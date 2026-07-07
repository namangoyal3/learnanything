/**
 * scripts/seo/config.mjs — SEO pipeline v2: single source of truth for every
 * gate threshold and state-file path.
 *
 * Thresholds come from the v2 spec in the 2026 SEO research report
 * (~/.cache/seo-best-practices-2026.md §"v2 spec"): quality gates (§1),
 * throughput ceiling (§2), circuit breaker + 30/60/90 gates (§3),
 * long-tail tracking (§4), prune (§5).
 *
 * Changing a number here changes what the pipeline enforces — treat edits as
 * policy changes, not tuning knobs (see implementation-notes.md).
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const SEO_DIR = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(SEO_DIR, "..", "..");

export const SITE = "https://learnanything.pro";
export const HOST = "learnanything.pro";

export const THRESHOLDS = {
  // §1a — internal linking gate
  MIN_INLINKS: 3, // planned contextual inlinks required before publish
  MAX_CLICK_DEPTH: 3, // new page must sit ≤3 clicks from home via its link sources

  // §1b — one-intent-per-page dedupe
  COSINE_REJECT: 0.85, // reject candidate when max cosine vs any existing page ≥ this

  // §2 — throughput ceiling
  MAX_PUBLISHES_PER_7D: 3, // hard cap (report: 2-3/week steady state)
  PROBE_BATCH_MAX: 10, // max live pages per cluster probe batch

  // §3 — portfolio circuit breaker + judgment windows
  CIRCUIT_BREAKER_MIN_INDEXED_PCT: 30, // halt ALL publishing below this sitemap-indexed%
  IMPRESSIONS_KILL_FLOOR: 10, // 90d verdict: <this many impressions/30d ≈ dead cluster
  GATE_WINDOWS_DAYS: { crawl: 30, impressions: 60, verdict: 90 },

  // §5 — prune
  PRUNE_KEEP_TARGET: [150, 200], // of the current ~1,393 sitemap URLs
  RESCUE_MAX_OUTLINKS: 25, // prune pass 2: pages with more body links are listing-shaped — their links are navigation, not endorsement

  // §4 — rank tracking
  MAX_RANK: 30,
  RANK_KEYWORDS_PER_RUN: 14, // long-tail terms checked per run
};

// State + config files. clusters.json / publish-ledger.json / prune-manifest.json
// are committed (reviewable state); the two caches are gitignored (bulky, derived).
export const FILES = {
  CLUSTERS: join(SEO_DIR, "clusters.json"),
  LEDGER: join(SEO_DIR, "publish-ledger.json"),
  GRAPH_CACHE: join(SEO_DIR, "site-graph-cache.json"),
  EMB_CACHE: join(SEO_DIR, "embeddings-cache.json"),
  GSC_MANUAL: join(SEO_DIR, "gsc-manual.json"),
  PRUNE_MANIFEST: join(SEO_DIR, "prune-manifest.json"),
};
