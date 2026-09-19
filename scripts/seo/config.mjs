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
  COSINE_REJECT: 0.85, // reject candidate when max cosine vs any existing page ≥ this (no-Jev fallback)
  COSINE_SHORTLIST: 0.35, // cosine floor for the pages Jev compares the candidate against
  DEDUPE_SHORTLIST: 8, // how many nearest pages Jev judges per candidate
  SAME_INTENT_REJECT: 0.5, // Jev noul "same reader question" at/above this = duplicate (fail-closed: more likely than not)

  // §2 — throughput ceiling
  MAX_PUBLISHES_PER_7D: 3, // hard cap (report: 2-3/week steady state)
  PROBE_BATCH_MAX: 10, // max live pages per cluster probe batch

  // §3 — portfolio circuit breaker + judgment windows
  // Visible% = sitemap paths with ≥1 GSC impression / 90d, `site:` probe
  // queries excluded (the Sitemaps API "indexed" count is dead — it read
  // 0/1393 forever). 2026-09-20: 1.7%; after the prune (751 keep): 2.9%.
  // The breaker opens when 226 kept pages earn an impression in a 90d window
  // — publishing is earned, not scheduled (docs/seo-autonomy.md).
  CIRCUIT_BREAKER_MIN_VISIBLE_PCT: 30, // halt ALL publishing below this
  IMPRESSIONS_KILL_FLOOR: 10, // 90d verdict: <this many impressions/30d ≈ dead cluster
  GATE_WINDOWS_DAYS: { crawl: 30, impressions: 60, verdict: 90 },

  // §5 — prune. Cut points read against the 2026-09-20 site-wide scoring
  // (1,393 pages, scripts/seo/page-value.mjs). The line sits on a level
  // boundary, not a midpoint: 2 = "usable" (one specific element), so
  // "shallow or worse" goes. A midpoint (2.5) put 147 hand-built guides on
  // the noindex list by a ±0.3 margin that the Score cannot resolve. Only
  // generated /learn/pm/* pages are cut on value; hand-built ones are listed
  // for rewrite. The "templated" noul is recorded, not cut on — it flagged
  // checklists and cheat sheets, not swapped-title pages.
  PRUNE_MERIT_MIN_IMPRESSIONS_90D: 10, // GSC evidence that keeps a page on its own (1-9 is Google testing, not demand)
  PRUNE_MIN_VALUE: 2, // Jev score position (0-4): ≥ "usable" — at least one specific element a reader can act on
  RESCUE_MAX_OUTLINKS: 25, // prune pass 2: pages with more body links are listing-shaped — their links are navigation, not endorsement

  // §4 — rank tracking
  MAX_RANK: 30,
  RANK_KEYWORDS_PER_RUN: 14, // long-tail terms checked per run

  // §6 — internal-linking playbook (scripts/seo/internal-links.mjs). Jev
  // probabilities are calibrated judgments, not permission to act — these
  // floors were picked on the first run's plan and should be re-read against
  // scripts/seo/internal-links-plan.json before being trusted site-wide.
  LINK_MIN_RELEVANCE: 0.6, // noul: reader of source benefits from a link to destination
  LINK_MAX_NONE_PROB: 0.3, // choice: mass on "none" above this = nothing fits, skip
  LINK_MIN_SENTENCE_PROB: 0.35, // choice: the winning sentence must stand out from the shortlist
  LINK_MIN_ANCHOR_PROB: 0.15, // choice: anchor windows overlap, so only reject a flat spread
  LINK_MIN_PILLAR_PROB: 0.5, // choice: the winning pillar must carry this much of the topic's probability
  LINK_MIN_DELIVERS: 0.6, // noul: clicking the anchor rewards the reader (final check on the assembled link)
  LINK_ANCHOR_VARIATION_RATIO: 0.8, // reuse-avoidance: take runner-up anchor if ≥ this × top prob
  LINK_MAX_NEW_PER_SOURCE: 3, // new contextual links added to one page per run
  LINK_MAX_NEW_PER_DEST: 6, // new inlinks one destination may gain per run (no link dumps)
  LINK_CANDIDATES_PER_SOURCE: 8, // fast-search shortlist handed to Jev for re-ranking
  LINK_SENTENCE_CANDIDATES: 10, // sentences offered to Jev per (source, destination)
  LINK_ANCHOR_CANDIDATES: 24, // 2–5-word windows offered to Jev per chosen sentence
  PAGE2_POSITION: [11, 20], // hack 6: "stuck on page 2" band (avg position, 90d)
  PAGE2_MIN_IMPRESSIONS: 10, // hack 6: query must recur, not be a one-off impression
  PAGE2_MIN_ANSWERS_QUERY: 0.6, // noul: destination actually answers the query
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
  // §6 internal links: plan + ledger are committed (reviewable), cache is gitignored.
  JEV_CACHE: join(SEO_DIR, "jev-cache.json"),
  LINKS_PLAN: join(SEO_DIR, "internal-links-plan.json"),
  LINKS_LEDGER: join(SEO_DIR, "internal-links-ledger.json"),
};
