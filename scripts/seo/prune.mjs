/**
 * scripts/seo/prune.mjs — prune manifest builder + (gated) executor (v2 spec §5).
 *
 * buildPruneManifest() is pure given its inputs and only WRITES A PLAN
 * (scripts/seo/prune-manifest.json). Nothing is deleted, 410'd or de-listed
 * by generating it.
 *
 * Keep criteria (report §2 "remove or improve", keep target ~150-200/1,393):
 *   1. any GSC impressions in the last 90d, or
 *   2. any GSC clicks in the last ~16 months, or
 *   3. core route (product surface, hubs, legal — regex list below), or
 *   4. body-linked (one hop) from a *merit*-kept page (impressions/clicks)
 *      whose out-degree ≤ RESCUE_MAX_OUTLINKS — hub/listing pages (e.g.
 *      /learn) are navigation, not endorsement; unrestricted, this pass
 *      blanket-rescued 1,076/1,393 on the first dry run, or
 *   5. intent-exemplar budget fill ("improve" bucket): remaining kill
 *      candidates are grouped by embedding cosine ≥ COSINE_REJECT (same
 *      threshold as the publish dedupe gate); the largest groups each keep
 *      one exemplar until keep reaches the target ceiling. Candidates that
 *      duplicate an already-kept page are never rescued.
 * Everything else → action "410".
 *
 * executePrune() is the ONLY destructive-adjacent path and it is double-gated:
 * it must receive {confirm:true} (set only by the --prune CLI flag) or it
 * throws. Even then it only writes artifacts a human deploys:
 *   - src/data/pruned-urls.json      (for a future 410 route handler)
 *   - seo-drafts/prune-runbook.md    (sitemap hygiene + removals-sitemap steps)
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { FILES, ROOT, THRESHOLDS } from "./config.mjs";
import { toPath } from "./crawl.mjs";
import { assignCluster } from "./clusters.mjs";
import { embedTexts, cosine } from "./embeddings.mjs";

// Product surface + hubs + legal — never prune regardless of GSC data.
export const CORE_ROUTES =
  /^\/$|^\/(pricing|explore|learn|login|signup|dashboard|interview-prep|privacy|terms|refund|about|contact)$/;

export async function buildPruneManifest({ sitemapUrls, pages90d, pages16mo, graph, clusters, embed = true, judge = null }) {
  const paths = sitemapUrls.map(toPath).filter(Boolean);
  const imp90 = new Map((pages90d || []).map((r) => [r.path, r]));
  const clk16 = new Map((pages16mo || []).map((r) => [r.path, r]));

  const entries = paths.map((p) => {
    const reasons = [];
    const i = imp90.get(p);
    const c = clk16.get(p);
    if (i?.impressions > 0) reasons.push(`impressions90d=${i.impressions}`);
    if (c?.clicks > 0) reasons.push(`clicks16mo=${c.clicks}`);
    if (CORE_ROUTES.test(p)) reasons.push("core-route");
    return { path: p, cluster: assignCluster(p, clusters), reasons, keep: reasons.length > 0 };
  });

  // Pass 2: one hop of body-links from *merit*-kept pages ("conversion role"
  // proxy). Sources must have earned GSC signals (core-route hubs are
  // navigation) and must not be listing-shaped: /learn body-links all 933
  // learn-pm pages and blanket-rescued the entire kill cluster before the
  // out-degree cap existed.
  const byPath = new Map(entries.map((e) => [e.path, e]));
  const meritKept = entries.filter(
    (e) => e.keep && e.reasons.some((r) => r.startsWith("impressions") || r.startsWith("clicks"))
  );
  for (const src of meritKept) {
    const links = graph?.pages?.[src.path]?.links || [];
    if (links.length > THRESHOLDS.RESCUE_MAX_OUTLINKS) continue; // listing-shaped — skip
    for (const dst of links) {
      const e = byPath.get(dst);
      if (e && !e.keep) {
        e.keep = true;
        e.reasons.push(`inlink-from-kept:${src.path}`);
      }
    }
  }

  // Pass 3 (budget fill, report's "improve" bucket): with ~0 search presence
  // the merit passes keep far fewer than the 150-200 target. Near-duplicate
  // intents collapse to one exemplar worth improving; rescue the largest
  // intent groups first, up to the target ceiling.
  const [lo, hi] = THRESHOLDS.PRUNE_KEEP_TARGET;
  let exemplar = { applied: false, provider: null, groups: 0, dupOfKept: 0, dupOverruled: 0, rescued: 0, judge: judge ? "jev-same-intent" : null };
  const textOf = (path) => (graph?.pages?.[path]?.text || "").slice(0, 2000);
  const budget0 = hi - entries.filter((e) => e.keep).length;
  if (embed && budget0 > 0) {
    const cands = entries.filter((e) => !e.keep && textOf(e.path).length >= 200);
    const keptWithText = entries.filter((e) => e.keep && textOf(e.path).length >= 200);
    if (cands.length) {
      const { providerId, vectors } = await embedTexts(
        [...keptWithText, ...cands].map((e) => textOf(e.path))
      );
      const keptVecs = vectors.slice(0, keptWithText.length);
      const candVecs = vectors.slice(keptWithText.length);
      // Dup-of-kept is the decision that keeps a page on the kill list. Cosine
      // (hash-tfidf when Ollama is down) only nominates the nearest kept page;
      // when a judge is supplied, Jev's "same reader question" makes the call.
      const fresh = [];
      const suspects = [];
      cands.forEach((e, i) => {
        let best = { k: -1, s: -1 };
        keptVecs.forEach((kv, k) => {
          const s = cosine(candVecs[i], kv);
          if (s > best.s) best = { k, s };
        });
        if (best.s >= THRESHOLDS.COSINE_REJECT) suspects.push({ e, i, kept: keptWithText[best.k] });
        else fresh.push({ e, v: candVecs[i], len: textOf(e.path).length });
      });
      let verdicts = null;
      if (judge && suspects.length) {
        verdicts = await judge(
          suspects.map((s) => ({
            a: { title: graph?.pages?.[s.e.path]?.title, path: s.e.path, text: textOf(s.e.path) },
            b: { title: graph?.pages?.[s.kept.path]?.title, path: s.kept.path, text: textOf(s.kept.path) },
          }))
        );
      }
      suspects.forEach((s, j) => {
        const same = verdicts ? verdicts[j] >= THRESHOLDS.SAME_INTENT_REJECT : true;
        if (same) {
          exemplar.dupOfKept++; // duplicates a kept page — stays killed
          if (verdicts) s.e.reasons.push(`dup-of-kept:${s.kept.path} (jev ${verdicts[j].toFixed(2)})`);
        } else {
          exemplar.dupOverruled++; // cosine said dup, Jev says different question
          fresh.push({ e: s.e, v: candVecs[s.i], len: textOf(s.e.path).length });
        }
      });
      fresh.sort((a, b) => b.len - a.len); // longest text leads its group
      const groups = [];
      for (const f of fresh) {
        const g = groups.find((g) => cosine(f.v, g.leader.v) >= THRESHOLDS.COSINE_REJECT);
        if (g) g.members.push(f);
        else groups.push({ leader: f, members: [f] });
      }
      groups.sort((a, b) => b.members.length - a.members.length);
      let budget = budget0;
      for (const g of groups) {
        if (budget <= 0) break;
        g.leader.e.keep = true;
        g.leader.e.reasons.push(`intent-exemplar:${g.members.length}pages`);
        budget--;
        exemplar.rescued++;
      }
      exemplar = { ...exemplar, applied: true, provider: providerId, groups: groups.length };
    }
  }

  const keep = entries.filter((e) => e.keep);
  const kill = entries.filter((e) => !e.keep).map((e) => ({ ...e, action: "410" }));
  const perCluster = {};
  for (const e of entries) {
    const k = e.cluster ?? "unassigned";
    perCluster[k] ??= { keep: 0, kill: 0 };
    perCluster[k][e.keep ? "keep" : "kill"]++;
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    criteria:
      "keep = impressions(90d)>0 | clicks(16mo)>0 | core-route | body-linked (1 hop) from a merit-kept page with ≤RESCUE_MAX_OUTLINKS body links | intent-exemplar budget fill (largest embedding-dedupe groups, up to target ceiling). kill → 410. External-backlink data not available via API — reviewer should spot-check kill list against Search Console/ahrefs before executing.",
    dataWindows: { impressions: "90d", clicks: "~16mo (GSC max)" },
    counts: {
      total: entries.length,
      keep: keep.length,
      kill: kill.length,
      target: `${lo}-${hi} keep`,
      onTarget: keep.length >= lo && keep.length <= Math.round(hi * 1.5),
    },
    perCluster,
    exemplar,
    keep: keep.map(({ path, cluster, reasons }) => ({ path, cluster, reasons })),
    // Kill rows carry a reason only when a judgment put them there (Jev dup-of-kept verdict).
    kill: kill.map(({ path, cluster, action, reasons }) => ({ path, cluster, action, ...(reasons?.length ? { reasons } : {}) })),
  };
  writeFileSync(FILES.PRUNE_MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  return manifest;
}

export function executePrune({ confirm = false } = {}) {
  if (!confirm) {
    throw new Error(
      "executePrune requires --prune. It is intentionally NOT run by cron or dry runs — a human must review scripts/seo/prune-manifest.json first (410ing ~1,200 URLs is irreversible in spirit: recrawl budget + quality prior)."
    );
  }
  if (!existsSync(FILES.PRUNE_MANIFEST)) throw new Error("no prune-manifest.json — run --prune-plan first");
  const manifest = JSON.parse(readFileSync(FILES.PRUNE_MANIFEST, "utf8"));
  const ageDays = (Date.now() - new Date(manifest.generatedAt).getTime()) / 864e5;
  if (ageDays > 7) throw new Error(`prune-manifest.json is ${ageDays.toFixed(1)}d old — regenerate with --prune-plan before executing`);

  const outDir = join(ROOT, "src", "data");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    join(outDir, "pruned-urls.json"),
    JSON.stringify({ generatedAt: manifest.generatedAt, status410: manifest.kill.map((k) => k.path) }, null, 2) + "\n"
  );
  const draftsDir = join(ROOT, "seo-drafts");
  mkdirSync(draftsDir, { recursive: true });
  writeFileSync(
    join(draftsDir, "prune-runbook.md"),
    [
      "# Prune runbook (generated — human deploys each step)",
      "",
      `Manifest: scripts/seo/prune-manifest.json (${manifest.counts.kill} → 410, ${manifest.counts.keep} keep)`,
      "",
      "1. Wire a 410 response for every path in src/data/pruned-urls.json (middleware or route handler).",
      "2. Filter those paths out of src/app/sitemap.ts — main sitemap lists only live 200 canonicals.",
      "3. Serve a temporary /sitemap-removed.xml with the 410'd URLs for ~4-6 weeks so Googlebot processes the removals faster, then delete it.",
      "4. lastmod must stay truthful — do not touch lastmod on surviving pages.",
      "5. DB rows for /learn/pm/* articles: set published=false; do NOT hard-delete.",
      "",
      "Expect indexed% to move over 2-6 months, step-changes around core updates.",
    ].join("\n") + "\n"
  );
  return { wrote: ["src/data/pruned-urls.json", "seo-drafts/prune-runbook.md"], counts: manifest.counts };
}
