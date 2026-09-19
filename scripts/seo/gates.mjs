/**
 * scripts/seo/gates.mjs — v2 pre-publish quality gates (spec §1-§3).
 *
 * Design: every gate is a small pure(ish) function returning
 * { pass, detail } so vitest can cover the decision logic without network,
 * and runPublishGates() is just an orchestrator. ALL gates fail closed:
 * missing data (no crawl cache, no GSC signal) blocks publishing rather than
 * waving it through — a page can always be published later; un-publishing
 * from Google's quality prior is what takes months.
 */
import { THRESHOLDS } from "./config.mjs";
import { validateFirstPartyBlock, loadDatasets } from "./datasets.mjs";
import { embedTexts, cosine } from "./embeddings.mjs";
import { sameIntent, isJevConfigured } from "./same-intent.mjs";

// ── §2 throughput ceiling ────────────────────────────────────────────────────
export function checkThroughput(publishTimestamps, now = Date.now(), cap = THRESHOLDS.MAX_PUBLISHES_PER_7D) {
  const weekAgo = now - 7 * 864e5;
  const recent = (publishTimestamps || []).filter((t) => new Date(t).getTime() > weekAgo);
  return {
    pass: recent.length < cap,
    detail: `${recent.length}/${cap} publishes in trailing 7d${recent.length >= cap ? " — weekly cap reached" : ""}`,
  };
}

// ── §2 probe batch (per cluster) ─────────────────────────────────────────────
export function checkProbeBatch(cluster, batchMax = THRESHOLDS.PROBE_BATCH_MAX) {
  if (!cluster) return { pass: false, detail: "candidate has no cluster assigned (payload.cluster required)" };
  if (cluster.status === "killed" || cluster.status === "frozen") {
    return { pass: false, detail: `cluster "${cluster.id}" is ${cluster.status} — no new pages` };
  }
  const inBatch = cluster.probeBatch?.published ?? 0;
  if (inBatch >= batchMax) {
    return {
      pass: false,
      detail: `cluster "${cluster.id}" probe batch full (${inBatch}/${batchMax}) — wait for its 60/90-day gate before the next batch`,
    };
  }
  return { pass: true, detail: `cluster "${cluster.id}" batch ${inBatch}/${batchMax}, status ${cluster.status}` };
}

// ── §3 portfolio circuit breaker ─────────────────────────────────────────────
export function circuitBreakerState(visiblePct, min = THRESHOLDS.CIRCUIT_BREAKER_MIN_VISIBLE_PCT) {
  if (visiblePct == null) {
    return {
      halted: true,
      reason: "visible% unknown — no GSC API creds and no scripts/seo/gsc-manual.json fallback; failing closed",
    };
  }
  if (visiblePct < min) {
    return { halted: true, reason: `sitemap visible ${visiblePct.toFixed(1)}% < ${min}% — publishing halted until the prune lands or visibility recovers` };
  }
  return { halted: false, reason: `sitemap visible ${visiblePct.toFixed(1)}% ≥ ${min}%` };
}

// ── §1a inlink plan ──────────────────────────────────────────────────────────
/**
 * plan: array of internal paths ("/pm-okr-guide") that will link to the new
 * page. Verified against the live sitemap set; click depth verified when a
 * crawl graph is available. Post-publish, the pipeline re-crawls the sources
 * to confirm the links actually shipped (verifyInlinksLive).
 */
export function checkInlinkPlan(plan, { sitemapPaths, depths = null }, t = THRESHOLDS) {
  const uniq = [...new Set((plan || []).map((p) => (p.startsWith("/") ? p : `/${p}`)))];
  const known = uniq.filter((p) => sitemapPaths.has(p));
  const unknown = uniq.filter((p) => !sitemapPaths.has(p));
  if (known.length < t.MIN_INLINKS) {
    return {
      pass: false,
      detail: `${known.length}/${t.MIN_INLINKS} valid inlink sources${unknown.length ? ` (not in sitemap: ${unknown.join(", ")})` : ""} — a page nobody links to is an orphan on arrival`,
    };
  }
  if (depths) {
    const reachable = known.filter((p) => depths[p] != null && depths[p] + 1 <= t.MAX_CLICK_DEPTH);
    if (reachable.length === 0) {
      return {
        pass: false,
        detail: `no inlink source puts the page ≤${t.MAX_CLICK_DEPTH} clicks from home (source depths: ${known.map((p) => `${p}=${depths[p] ?? "?"}`).join(", ")})`,
      };
    }
  }
  return { pass: true, detail: `${known.length} valid sources${depths ? ", depth ok" : " (depth unchecked — no crawl graph)"}` };
}

export async function verifyInlinksLive(newPath, sourcePaths, fetchPage) {
  const missing = [];
  for (const src of sourcePaths) {
    const html = await fetchPage(src).catch(() => "");
    if (!html.includes(`href="${newPath}"`) && !html.includes(`href="https://learnanything.pro${newPath}"`)) missing.push(src);
  }
  return { pass: missing.length === 0, detail: missing.length ? `links not live yet on: ${missing.join(", ")}` : "all planned inlinks live" };
}

// ── §1b one-intent-per-page dedupe ───────────────────────────────────────────
export async function checkDedupe(candidateText, existingPages, t = THRESHOLDS, judge = isJevConfigured() ? sameIntent : null) {
  if (!existingPages?.length) {
    return { pass: false, detail: "no crawled page texts available — run `node scripts/seo-pipeline.mjs --refresh-graph` first (failing closed)" };
  }
  const { providerId, vectors } = await embedTexts([candidateText, ...existingPages.map((p) => p.text)]);
  const cand = vectors[0];
  const scored = existingPages.map((p, i) => ({ p, score: cosine(cand, vectors[i + 1]) })).sort((a, b) => b.score - a.score);
  const worst = { url: scored[0].p.path, score: scored[0].score };

  // Cosine is the fast shortlist (rerank-cookbook step 1); the reject
  // decision is Jev's calibrated "same reader question" when configured.
  // Without a key the old cosine threshold applies unchanged.
  const shortlist = scored.filter((x) => x.score >= t.COSINE_SHORTLIST).slice(0, t.DEDUPE_SHORTLIST);
  if (judge && shortlist.length) {
    const [title, ...rest] = candidateText.split("\n");
    const probs = await judge(shortlist.map((x) => ({ a: { title, text: rest.join("\n") }, b: x.p })));
    let top = { url: null, p: -1 };
    probs.forEach((p, i) => {
      if (p > top.p) top = { url: shortlist[i].p.path, p };
    });
    return {
      pass: top.p < t.SAME_INTENT_REJECT,
      detail: `jev same-intent ${top.p.toFixed(2)} vs ${top.url} (threshold ${t.SAME_INTENT_REJECT}; shortlist ${shortlist.length} by cosine ≥ ${t.COSINE_SHORTLIST}, max cosine ${worst.score.toFixed(3)} ${providerId})`,
    };
  }
  const pass = worst.score < t.COSINE_REJECT;
  return {
    pass,
    detail: `max cosine ${worst.score.toFixed(3)} vs ${worst.url} (${providerId}, threshold ${t.COSINE_REJECT}, n=${existingPages.length}${judge ? "" : "; no TYPESAFE_API_KEY — cosine rule"})`,
  };
}

// ── orchestrator ─────────────────────────────────────────────────────────────
/**
 * candidate: { title, body, cluster: string, inlinkFrom: string[] }
 * ctx: { sitemapPaths:Set, depths|null, existingPages:[{path,text}],
 *        ledgerTimestamps:[], clusterCfg|null, visiblePct|null }
 */
export async function runPublishGates(candidate, ctx) {
  const gates = [];
  const breaker = circuitBreakerState(ctx.visiblePct);
  gates.push({ id: "circuit-breaker", pass: !breaker.halted, detail: breaker.reason });
  gates.push({ id: "throughput-cap", ...checkThroughput(ctx.ledgerTimestamps) });
  gates.push({ id: "probe-batch", ...checkProbeBatch(ctx.clusterCfg) });
  gates.push({ id: "inlinks", ...checkInlinkPlan(candidate.inlinkFrom, ctx) });
  gates.push({ id: "first-party-data", ...toGate(validateFirstPartyBlock(candidate.body, ctx.datasets ?? loadDatasets())) });
  gates.push({ id: "intent-dedupe", ...(await checkDedupe(`${candidate.title}\n${candidate.body}`, ctx.existingPages)) });
  return { pass: gates.every((g) => g.pass), gates, failures: gates.filter((g) => !g.pass).map((g) => `${g.id}: ${g.detail}`) };
}

const toGate = (r) => ({ pass: r.pass, detail: r.reason });
