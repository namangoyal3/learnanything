# SEO pipeline v2 — implementation notes (branch `seo-v2`)

Running log for the reviewer. Spec: `~/.cache/seo-best-practices-2026.md` ("v2 spec" section + §2/§6).
Status: implemented, dry-run only. **Nothing published, nothing deployed, nothing pushed, prune NOT executed.**

## What exists now

```
scripts/seo/
  config.mjs           all thresholds + state-file paths (policy lives HERE, nowhere else)
  gates.mjs            §1-§3 publish gates, pure decision fns + orchestrator (fail closed)
  embeddings.mjs       §1b dedupe embeddings: local Ollama if a model is pulled, else hashed TF fallback
  crawl.mjs            site link-graph builder (contextual links only — header/footer/nav stripped)
  datasets.mjs         §1c first-party data registry + block validator (anti-hallucination spot-check)
  clusters.mjs         cluster assignment + 30/60/90 impressions-led verdicts (pure fn)
  clusters.json        cluster registry: 6 clusters, per-cluster long-tail keywords, statuses
  gsc-pages.mjs        GSC page/cluster-level queries + indexed% (API → manual JSON → null)
  prune.mjs            §5 manifest builder (plan only) + double-gated executor
  publisher-gates.mjs  the one entry point publish-seo-articles.ts calls; owns publish-ledger.json
  publish-ledger.json  append-only publish log for the 3/7d cap (committed)
  prune-manifest.json  generated keep/kill plan (committed for review)
scripts/seo-pipeline.mjs   rewritten v2 entry point — cron-compatible (see below)
scripts/publish-seo-articles.ts  now calls runV2PublishGates() before any prisma.article.create
src/lib/__tests__/seo-v2-gates.test.ts  23 tests over the pure decision fns
```

Caches (gitignored): `scripts/seo/site-graph-cache.json`, `scripts/seo/embeddings-cache.json`.

## Gate thresholds (scripts/seo/config.mjs — treat edits as policy changes)

| Gate | Threshold | Notes |
|---|---|---|
| §1a inlinks | ≥3 planned contextual inlinks, sources must exist in sitemap; ≤3 clicks from home when graph available | nav/footer links don't count — crawler strips chrome before link extraction |
| §1b intent dedupe | reject if max cosine ≥ **0.85** vs existing pages (candidate vs own cluster + all top-level pages, cap 400) | provider recorded per check |
| §1c first-party data | `<!-- first-party-data: <id> -->` block, ≥3 data rows, ≥2 values verbatim from a registered repo dataset | registered: `pm-quiz-bank` (prisma/seed.ts), `india-pm-salary-2026` (salary page), `lesson-catalog` (sitemap) |
| §2 throughput | hard cap **3 publishes / trailing 7d** (report: 2-3/wk) | publish-ledger.json |
| §2 probe batch | ≤**10** live pages per cluster batch; frozen/killed clusters refuse publishes | clusters.json |
| §3 circuit breaker | halt ALL publishing when sitemap-indexed% < **30** | **fail closed**: unknown indexed% also halts |
| §3 windows | 30d crawl-check (warn only) / 60d impressions (freeze if 0) / 90d continue-freeze-kill, cluster-level only | `computeClusterVerdict()` |
| §5 prune | keep target 150-200 of 1,393 | manifest only; executor double-gated |

## Decisions a reviewer should sanity-check

1. **No embedding tooling existed in the repo** (no `embedding`/`cosine` hits outside rank history). Chose: local **Ollama** embedding model if one is already pulled (never pulls), else a **hashed word+3gram TF vector** (1024-dim). The fallback is lexical — great at catching the templated near-dupes programmatic generation produces, weak on paraphrase-level overlap. Provider id is recorded in every gate detail so you know which semantics 0.85 meant. If you want true semantic dedupe: `ollama pull nomic-embed-text` and re-run; caches invalidate per provider automatically.
2. **All gates fail closed** — missing crawl cache, missing GSC creds, missing manual fallback ⇒ publish blocked. Rationale in gates.mjs header.
3. **Inlink gate counts contextual links only** (header/footer/nav stripped before extraction). Sitewide chrome can't satisfy the ≥3 rule; hub listing pages still count (their lists are body content).
4. **`learn-pm` cluster manually pinned `frozen`** in clusters.json — it's the 938-page unindexed bulk the report says to stop feeding. Pipeline verdicts don't unpin manual freezes.
5. **Per-URL indexed state is NOT wired** (URL Inspection API). `TODO(seo-v2)` in `clusters.mjs:indexedStateForUrls()`. Interface + manual fallback (`scripts/seo/gsc-manual.json`) exist; portfolio-level indexed% comes from the GSC sitemaps API and IS wired.
6. **Prune keep criteria**: impressions(90d)>0 ∨ clicks(16mo)>0 ∨ core route ∨ body-linked from a kept page (1 hop). External backlinks aren't API-accessible — spot-check the kill list against Search Console links report before executing.
7. **Cluster ages are unknown** (`firstPublishedAt: null` — pre-v2 inventory), so existing clusters are judged at the 90d stage. New clusters get real timestamps via the ledger.
8. **Publisher payloads need two new fields**: `cluster` (id from clusters.json) and `inlinkFrom` (≥3 existing paths). See `seo-articles/EXAMPLE-v2-payload.json`.

## Surprising things found in v1 (unchanged, but you should know)

- v1's `KEYWORDS` head terms are kept, behind `--vanity` only.
- v1 `site:` first-page Google counting is a floor, not a metric (report §6) — retained for trend continuity, but the breaker uses the real GSC sitemaps number.
- The working tree had uncommitted prior work (GSC metrics wiring, Bing-GSC-import tooling, CLAUDE.md rewrite) — committed as the baseline commit `6e0eb8d` so v2's diff is reviewable on its own.
- `scripts/seo-rank-history.json` is gitignored — v2 keeps writing it, plus new fields (`gscIndexedPct`, `circuitBreaker`, `clusterVerdicts`).

## Cron compatibility (§6 of task)

Entry point unchanged: `node scripts/seo-pipeline.mjs [--no-indexnow] [--no-google]` still runs the full measurement cycle with zero new required args. `~/Library/Scripts/seo-pipeline-cron.sh` and the LaunchAgent were **not** touched. New flags (`--dry-run`, `--prune-plan`, `--prune`, `--refresh-graph`, `--gate-check`, `--vanity`, `--crawl-sample`) are all opt-in.

## Dry-run results

(filled in below after the run — see "Dry run" section)

## What needs human sign-off before re-enabling the LaunchAgent

1. **Review `scripts/seo/prune-manifest.json`** (keep/kill counts below) — especially: no page with external backlinks or brand value on the kill list. Then, and only then, a human runs `node scripts/seo-pipeline.mjs --prune` and follows `seo-drafts/prune-runbook.md` (410 wiring, sitemap filter, temporary removals sitemap ~4-6 weeks).
2. **Confirm the frozen status of `learn-pm`** and the initial statuses/long-tail keyword lists in `scripts/seo/clusters.json`.
3. **Threshold sign-off** on config.mjs values (0.85 cosine, 3/7d, 10/batch, 30% breaker).
4. **Decide the embedding provider** (accept hash fallback vs pull an Ollama embed model).
5. Merge `seo-v2` → main and deploy — until deployed, prod still serves all 1,393 URLs and the old sitemap.
6. Note: with indexed% far below 30, the breaker keeps ALL publishing halted even after re-enabling the cron — that is by design; the cron becomes measurement-only until index health recovers.

## Session addendum — GSC findings, prune-plan fixes, gate demo (2026-07-08)

### GSC findings (via gsc-api, pre-crash)
- Sitemap coverage: **0/1,393 indexed (0.0%)** → circuit breaker halts ALL publishing
  (fails the 30% floor). Pipeline is measurement-only until index health recovers.
- 90d cluster verdicts: **kill ×4**; **watch**: `career-transitions`, `guides-frameworks`.

### Fixes found while reviewing the first prune dry run
1. **Crawler crash on slow origins.** Full crawl died with `fetch failed` /
   `UND_ERR_CONNECT_TIMEOUT` (undici). `fetchText` in `scripts/seo-pipeline.mjs` now
   uses an AbortController timeout + retries, so one slow URL can't abort the cycle.
2. **Blanket rescue via listing pages.** Pass 2 originally counted *any* inlink from
   a kept page as merit; `/learn` hub pages body-link to nearly everything, so the
   first dry run rescued 1,076/1,393 kill candidates. Fix (`scripts/seo/prune.mjs`):
   an inlink counts only when the source page was kept on merit (not itself rescued)
   AND has out-degree ≤ `RESCUE_MAX_OUTLINKS` (25) — listing-shaped pages are
   navigation, not endorsement.
3. **Intent-exemplar budget fill (new pass 5).** Remaining kill candidates grouped by
   embedding cosine ≥ `COSINE_REJECT` (0.85, same threshold as the dedupe gate);
   largest groups donate one exemplar into the "improve" bucket until keep reaches the
   target ceiling. Candidates duplicating an already-kept page stay killed. Manifest
   records the embedding provider used.
4. **First-party data gate was un-satisfiable.** `datasets.mjs` extracted questions
   with `question:` but `prisma/seed.ts` uses `questionText:` → 0 questions matched
   and the snapshot contained a bare `"0"` that substring-matched any digit (false
   positive). Fixed the regex (69/73 questions captured; 4 exceed the 80-char window)
   and the count value is now only emitted when > 0. `EXAMPLE-v2-payload.json`
   corrected: bank size is 73 (was 103) and the block now quotes two verbatim
   questions from seed.ts.

### Prune manifest (scripts/seo/prune-manifest.json, generated 2026-07-07T19:57:30.632Z)
- 1,393 total → **200 keep / 1,193 kill** (target 150–200 keep — on target).
- Keep buckets: 104 inlink-from-kept (bounded rescue) · 56 intent-exemplar ·
  33 impressions90d · 7 core-route.
- Exemplar pass: 980 cosine groups, 56 rescued, 4 dup-of-kept; provider
  `hash-tfidf-v1` (Ollama unavailable during the run — hashed-TF fallback).

### Gate-check demo (EXAMPLE-v2-payload.json)
- 5/6 gates pass: throughput-cap 0/3 (7d), probe-batch 0/10 (`interview-skills`),
  inlinks 3 valid sources, first-party-data 4 rows / 2 verbatim values,
  intent-dedupe max cosine 0.645 < 0.85.
- circuit-breaker ✗ (indexed 0.0% < 30%) → **BLOCKED**. This is the intended
  fail-closed behavior given the real GSC state.
- Gate test suite: 23/23 passing after the datasets.mjs fix.

### Human sign-off needed before re-enabling the LaunchAgent
1. Review the kill list (1,193 URLs → HTTP 410) against Search Console link report /
   ahrefs — external-backlink data is NOT available via API, this was never
   spot-checked.
2. Exemplar rescues used the `hash-tfidf-v1` fallback; consider re-running the prune
   plan with real (Ollama) embeddings before executing kills.
3. Confirm the breaker posture: with 0% indexed, re-enabling the cron yields
   measurement-only runs (no publishing) — that is by design.
4. Prune execution is manual-only; nothing in this branch deletes or 410s pages.
