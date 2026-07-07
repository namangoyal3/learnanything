/**
 * scripts/seo/clusters.mjs — cluster registry + 30/60/90-day judgment gates
 * (v2 spec §3-§4). Clusters are defined in scripts/seo/clusters.json (committed,
 * human-editable); this module assigns URLs to clusters and computes
 * impressions-led verdicts per the report's measurement loop:
 *
 *   30d → crawl/index sanity check (warn, never kill)
 *   60d → impressions check (freeze if zero)
 *   90d → continue / freeze / kill — kill at CLUSTER level, never page level.
 *
 * "Impressions lead rankings by weeks; a cluster with rising impressions and
 * no top-30 rank yet is working — don't kill it." (report §6)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { FILES, THRESHOLDS } from "./config.mjs";

export function loadClusters() {
  return JSON.parse(readFileSync(FILES.CLUSTERS, "utf8"));
}

export function saveClusters(clusters) {
  writeFileSync(FILES.CLUSTERS, JSON.stringify(clusters, null, 2) + "\n");
}

/** First matching pattern wins; keep the catch-all last in clusters.json. */
export function assignCluster(path, clusters) {
  for (const c of clusters.clusters) {
    if (new RegExp(c.pattern).test(path)) return c.id;
  }
  return null;
}

/**
 * Pure verdict function — unit-tested. ageDays === null means "pre-v2
 * inventory, age unknown"; those clusters are months old, so they're judged
 * at the 90d stage.
 */
export function computeClusterVerdict(
  { ageDays, impressions30d, impressionsPrev30d, indexedPct, hasTop30Query },
  t = THRESHOLDS
) {
  const w = t.GATE_WINDOWS_DAYS;
  const imp = impressions30d ?? 0;
  const prev = impressionsPrev30d ?? 0;

  if (ageDays != null && ageDays < w.crawl) {
    return { stage: "pre-30d", verdict: "watch", reason: "too early to judge (＜30d)" };
  }
  if (ageDays != null && ageDays < w.impressions) {
    return imp > 0
      ? { stage: "30d", verdict: "continue", reason: `impressions started (${imp}/30d) — on track` }
      : { stage: "30d", verdict: "watch", reason: "0 impressions at 30d — check crawl/index state + internal links (not a kill signal yet)" };
  }
  if (ageDays != null && ageDays < w.verdict) {
    if (imp > 0 && imp >= prev) return { stage: "60d", verdict: "continue", reason: `impressions ${prev}→${imp} — Google is testing the cluster` };
    if (imp > 0) return { stage: "60d", verdict: "watch", reason: `impressions falling ${prev}→${imp}` };
    return { stage: "60d", verdict: "freeze", reason: "0 impressions at 60d — freeze new pages, fix internal links/content before spending more" };
  }
  // ≥90d (or age unknown ⇒ mature)
  if (imp >= t.IMPRESSIONS_KILL_FLOOR || hasTop30Query) {
    return { stage: "90d", verdict: "continue", reason: `alive: ${imp} impressions/30d${hasTop30Query ? " + top-30 query" : ""}` };
  }
  if (imp > 0 && imp > prev) {
    return { stage: "90d", verdict: "watch", reason: `low but rising (${prev}→${imp}) — Google testing; don't kill` };
  }
  if (imp > 0) {
    return { stage: "90d", verdict: "freeze", reason: `${imp} impressions/30d after 90d — freeze; improve-or-prune per page` };
  }
  return {
    stage: "90d",
    verdict: "kill",
    reason: `~0 impressions after 90d${indexedPct != null ? `, indexed ${indexedPct}%` : ""} — negative-value inventory; 410 via prune plan`,
  };
}

/**
 * Per-URL indexed state — NOT wired yet.
 *
 * TODO(seo-v2): implement via GSC URL Inspection API
 * (urlInspection/index:inspect, 2k inspections/day — plenty at 1.4k URLs).
 * Needs the same service account with Owner permission on the property.
 * Until then: manual fallback file scripts/seo/gsc-manual.json:
 *   { "indexedPct": 8.5, "urlIndexed": { "/some-path": true, ... } }
 * (export from Search Console UI → Pages report). Returns null when neither
 * source exists — callers must treat null as "unknown" and fail closed.
 */
export function indexedStateForUrls(paths) {
  if (existsSync(FILES.GSC_MANUAL)) {
    try {
      const manual = JSON.parse(readFileSync(FILES.GSC_MANUAL, "utf8"));
      if (manual.urlIndexed) {
        return Object.fromEntries(paths.map((p) => [p, manual.urlIndexed[p] ?? null]));
      }
    } catch {
      /* fall through */
    }
  }
  return null;
}
