/**
 * scripts/seo/prune.mjs — prune manifest builder + (gated) executor (v2 spec §5).
 *
 * buildPruneManifest() is pure given its inputs and only WRITES A PLAN
 * (scripts/seo/prune-manifest.json). Nothing is deleted, 410'd or de-listed
 * by generating it.
 *
 * Keep criteria (report §2 "remove or improve"; policy in docs/seo-autonomy.md):
 *   1. ≥ PRUNE_MERIT_MIN_IMPRESSIONS_90D GSC impressions in the last 90d, or
 *   2. any GSC clicks in the last ~16 months, or
 *   3. core route (product surface, hubs, legal — regex list below), or
 *   4. body-linked (one hop) from a *merit*-kept page (impressions/clicks)
 *      whose out-degree ≤ RESCUE_MAX_OUTLINKS — hub/listing pages (e.g.
 *      /learn) are navigation, not endorsement; unrestricted, this pass
 *      blanket-rescued 1,076/1,393 on the first dry run, or
 *   5. value pass (Jev, scripts/seo/page-value.mjs): a zero-evidence page
 *      stays when its standalone value ≥ PRUNE_MIN_VALUE, it is not templated
 *      (thin < PRUNE_MAX_THIN), and it does not answer the same reader
 *      question as a page already kept (embedding cosine nominates the
 *      nearest kept page; the same-intent judge decides). Two keepable
 *      near-duplicates keep the higher-value one.
 * Everything else → action "noindex" (reversible; 410 is a later, separate
 * human step — see the runbook). Without TYPESAFE_API_KEY the value pass is
 * skipped and the manifest is marked non-executable.
 *
 * executePrune() is the ONLY destructive-adjacent path and it is double-gated:
 * it must receive {confirm:true} (set only by the --prune CLI flag) or it
 * throws. Even then it only writes artifacts a human deploys:
 *   - src/data/pruned-urls.json      (paths to serve with <meta name=robots content=noindex>)
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

export async function buildPruneManifest({ sitemapUrls, pages90d, pages16mo, graph, clusters, embed = true, judge = null, valueJudge = null, write = true }) {
  const paths = sitemapUrls.map(toPath).filter(Boolean);
  const imp90 = new Map((pages90d || []).map((r) => [r.path, r]));
  const clk16 = new Map((pages16mo || []).map((r) => [r.path, r]));

  const entries = paths.map((p) => {
    const reasons = [];
    const i = imp90.get(p);
    const c = clk16.get(p);
    if (i?.impressions >= THRESHOLDS.PRUNE_MERIT_MIN_IMPRESSIONS_90D) reasons.push(`impressions90d=${i.impressions}`);
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

  // Pass 3 (value pass): 84% of the sitemap has no GSC evidence either way, so
  // the fill needs a judgment of what a reader would lose. Jev scores each
  // page once (cached); code owns the cut. Duplicate detection stays two-step:
  // cosine nominates the nearest kept page, the same-intent judge decides.
  const textOf = (path) => (graph?.pages?.[path]?.text || "").slice(0, 2000);
  const pageOf = (path) => ({ title: graph?.pages?.[path]?.title, path, text: textOf(path) });
  let valuePass = { applied: false, judge: valueJudge ? "jev-page-value" : null, scored: 0, keepable: 0, dupOfKept: 0, dupOverruled: 0, dupAmongKeepable: 0, rescued: 0 };
  const cands = entries.filter((e) => !e.keep && textOf(e.path).length >= 200);
  if (valueJudge && cands.length) {
    const values = await valueJudge(cands.map((e) => pageOf(e.path)));
    const keepable = [];
    cands.forEach((e, i) => {
      const { value, thin } = values[i];
      e.value = Math.round(value * 100) / 100;
      e.thin = Math.round(thin * 100) / 100;
      if (value >= THRESHOLDS.PRUNE_MIN_VALUE && thin < THRESHOLDS.PRUNE_MAX_THIN) keepable.push(e);
    });
    keepable.sort((a, b) => b.value - a.value);
    valuePass = { ...valuePass, applied: true, scored: cands.length, keepable: keepable.length };

    const kept = entries.filter((e) => e.keep && textOf(e.path).length >= 200);
    if (embed && keepable.length) {
      const { vectors } = await embedTexts([...kept, ...keepable].map((e) => textOf(e.path)));
      const keptVecs = vectors.slice(0, kept.length);
      const candVecs = vectors.slice(kept.length);
      // Nearest already-kept page (merit/inlink) or higher-value keepable page.
      const leaders = kept.map((e, k) => ({ e, v: keptVecs[k] }));
      const pairs = [];
      keepable.forEach((e, i) => {
        let best = { leader: null, s: -1 };
        for (const l of leaders) {
          const sc = cosine(candVecs[i], l.v);
          if (sc > best.s) best = { leader: l.e, s: sc };
        }
        pairs.push(best.s >= THRESHOLDS.COSINE_REJECT ? { e, leader: best.leader } : null);
        leaders.push({ e, v: candVecs[i] }); // later (lower-value) pages can duplicate this one
      });
      const suspects = pairs.filter(Boolean);
      const verdicts = judge && suspects.length ? await judge(suspects.map((s) => ({ a: pageOf(s.e.path), b: pageOf(s.leader.path) }))) : null;
      const dup = new Set();
      suspects.forEach((s, j) => {
        const same = verdicts ? verdicts[j] >= THRESHOLDS.SAME_INTENT_REJECT : true;
        if (!same) {
          valuePass.dupOverruled++;
          return;
        }
        dup.add(s.e.path);
        s.e.reasons.push(`dup-of-kept:${s.leader.path}${verdicts ? ` (jev ${verdicts[j].toFixed(2)})` : ""}`);
        if (s.leader.keep) valuePass.dupOfKept++;
        else valuePass.dupAmongKeepable++;
      });
      for (const e of keepable) {
        if (dup.has(e.path)) continue;
        e.keep = true;
        e.reasons.push(`value=${e.value} thin=${e.thin}`);
        valuePass.rescued++;
      }
    } else {
      for (const e of keepable) {
        e.keep = true;
        e.reasons.push(`value=${e.value} thin=${e.thin}`);
        valuePass.rescued++;
      }
    }
  }

  const keep = entries.filter((e) => e.keep);
  const noindex = entries.filter((e) => !e.keep).map((e) => ({ ...e, action: "noindex" }));
  const perCluster = {};
  for (const e of entries) {
    const k = e.cluster ?? "unassigned";
    perCluster[k] ??= { keep: 0, noindex: 0 };
    perCluster[k][e.keep ? "keep" : "noindex"]++;
  }
  const visibleKept = keep.filter((e) => imp90.get(e.path)?.impressions > 0).length;

  const manifest = {
    generatedAt: new Date().toISOString(),
    criteria: `keep = impressions(90d)≥${THRESHOLDS.PRUNE_MERIT_MIN_IMPRESSIONS_90D} | clicks(16mo)>0 | core-route | body-linked (1 hop) from a merit-kept page with ≤${THRESHOLDS.RESCUE_MAX_OUTLINKS} body links | value pass: Jev value≥${THRESHOLDS.PRUNE_MIN_VALUE} and thin<${THRESHOLDS.PRUNE_MAX_THIN} and not same-intent (≥${THRESHOLDS.SAME_INTENT_REJECT}) as a kept page. Everything else → noindex (reversible). External-backlink data is not available via API — spot-check the noindex list against Search Console/ahrefs before executing.`,
    dataWindows: { impressions: "90d", clicks: "~16mo (GSC max)" },
    counts: {
      total: entries.length,
      keep: keep.length,
      noindex: noindex.length,
      // What the circuit breaker's visible% becomes once the sitemap lists only the keep set.
      visiblePctAfter: keep.length ? Math.round((visibleKept / keep.length) * 1000) / 10 : null,
    },
    perCluster,
    valuePass,
    keep: keep.map(({ path, cluster, reasons, value, thin }) => ({ path, cluster, reasons, ...(value != null ? { value, thin } : {}) })),
    // Noindex rows carry value/thin when scored and a reason only when a judgment put them there.
    noindex: noindex.map(({ path, cluster, action, reasons, value, thin }) => ({ path, cluster, action, ...(value != null ? { value, thin } : {}), ...(reasons?.length ? { reasons } : {}) })),
  };
  if (write) writeFileSync(FILES.PRUNE_MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  return manifest;
}

export function executePrune({ confirm = false } = {}) {
  if (!confirm) {
    throw new Error(
      "executePrune requires --prune. It is intentionally NOT run by cron or dry runs — a human must review scripts/seo/prune-manifest.json first (noindexing ~900 URLs is reversible, but recrawl budget and the quality prior are not free)."
    );
  }
  if (!existsSync(FILES.PRUNE_MANIFEST)) throw new Error("no prune-manifest.json — run --prune-plan first");
  const manifest = JSON.parse(readFileSync(FILES.PRUNE_MANIFEST, "utf8"));
  if (!manifest.valuePass?.applied) throw new Error("prune-manifest.json was built without the Jev value pass (no TYPESAFE_API_KEY) — not executable; regenerate with the key set");
  const ageDays = (Date.now() - new Date(manifest.generatedAt).getTime()) / 864e5;
  if (ageDays > 7) throw new Error(`prune-manifest.json is ${ageDays.toFixed(1)}d old — regenerate with --prune-plan before executing`);

  const outDir = join(ROOT, "src", "data");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    join(outDir, "pruned-urls.json"),
    JSON.stringify({ generatedAt: manifest.generatedAt, noindex: manifest.noindex.map((k) => k.path) }, null, 2) + "\n"
  );
  const draftsDir = join(ROOT, "seo-drafts");
  mkdirSync(draftsDir, { recursive: true });
  writeFileSync(
    join(draftsDir, "prune-runbook.md"),
    [
      "# Prune runbook (generated — human deploys each step)",
      "",
      `Manifest: scripts/seo/prune-manifest.json (${manifest.counts.noindex} → noindex, ${manifest.counts.keep} keep, visible% after ≈ ${manifest.counts.visiblePctAfter})`,
      "",
      "1. Render <meta name=\"robots\" content=\"noindex\"> for every path in src/data/pruned-urls.json (layout or middleware). Pages stay live and reversible.",
      "2. Filter those paths out of src/app/sitemap.ts — the sitemap lists only the keep set.",
      "3. Serve a temporary /sitemap-removed.xml with the noindexed URLs for ~4-6 weeks so Googlebot processes the removals faster, then delete it.",
      "4. lastmod must stay truthful — do not touch lastmod on surviving pages.",
      "5. DB rows for /learn/pm/* articles: set published=false; do NOT hard-delete.",
      "6. After 60 days, if a path is still noindexed and nobody reversed it, it may become a 410 — a separate, human-run step.",
      "",
      "Expect visible% and impressions on the keep set to move over 2-6 months, step-changes around core updates.",
    ].join("\n") + "\n"
  );
  return { wrote: ["src/data/pruned-urls.json", "seo-drafts/prune-runbook.md"], counts: manifest.counts };
}
