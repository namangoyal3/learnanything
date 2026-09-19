# SEO autonomy policy

Decided 2026-09-20 from Search Console data and a Jev site-wide scoring pass.
This file is the policy. `scripts/seo/config.mjs` holds the numbers. Change a
number there, and the loop enforces the new policy on the next run.

## The decision

For the next 90 days the autonomous loop shrinks and measures. It does not
publish. Publishing resumes on its own when the site earns it (see "Breaker").

Why: on 2026-09-20 the site has 1,393 sitemap URLs. In the last 90 days, 24 of
them received a real search impression, 1 received a click. 74% of the
"impressions" in Jul–Aug came from the pipeline's own `site:` probe. Two cloud
crons (`/api/cron/generate-seo`, `/api/geo/create/tick`) were built to add
pages every day with no portfolio-level gate. The local pipeline that had the
gates stopped on 2026-07-31 (its launchd job is gone) and, when it ran, its
breaker read a dead metric (Sitemaps API `indexed` = 0 forever), so it could
never open, and its cluster kills were permanent.

## What the loop does each day

`~/Library/Scripts/seo-pipeline-cron.sh` runs `node scripts/seo-pipeline.mjs`
once a day at 07:07. Sunday adds `--vanity`. Google rank checks need
`--google` and never run from cron: the old `site:` probe polluted the data
the loop reads.

| Step | Owner | Judgment | Reversible |
| --- | --- | --- | --- |
| Fetch sitemap; submit IndexNow when the URL set changed | code | none | yes |
| Read GSC page × query rows; drop `site:` probe queries | code | none | – |
| Breaker: visible% = sitemap paths with ≥1 impression / 90d | code | none | – |
| Cluster verdict (30/60/90-day windows) and status | code | none | yes — status follows the latest verdict |
| Weekly `--prune-plan`: build the noindex manifest | code + Jev | page value, templated, same intent | plan only |
| Monday `internal-links.mjs`: plan contextual links (human runs `--apply`, commits) | code + Jev | relevance, sentence, anchor, delivers | ledger records each link |
| Publish a new page (≤3 per 7 days) | code + Jev | same intent, citability | yes |
| Execute the prune (`--prune`) | human | reads the manifest | noindex, yes; 410 later, no |

Jev answers are cached in `scripts/seo/jev-cache.json`. A re-cut with new
thresholds costs no inference. The full site scoring (1,393 pages) took 13 s
and 1.0M input tokens ($0.04).

## Breaker

The breaker halts every publish path below `CIRCUIT_BREAKER_MIN_VISIBLE_PCT`
(30%). Visible% today: 1.7%. After the prune below: 4%. The breaker opens when
127 of the 422 kept pages receive an impression in a 90-day window. That is
the definition of "Google engages with this site". Until then, new pages cost
crawl budget and lower the quality prior. Nothing else opens it.

The cloud crons must obey the same breaker. Owner action, before PR #42
merges: remove `/api/cron/generate-seo` and `/api/geo/create/tick` from
`vercel.json` `crons`. PR #42 repairs the Groq → OpenRouter fallback that
those crons died on, so the merge revives them.

## Prune

`buildPruneManifest` keeps a page when one of these holds:

1. ≥ `PRUNE_MERIT_MIN_IMPRESSIONS_90D` (10) impressions in 90 days.
2. Any click in 16 months.
3. Core route (product surface, hubs, legal).
4. Body-linked from a merit-kept page with ≤ 25 body links.
5. Value pass: Jev value ≥ `PRUNE_MIN_VALUE` (2.5 of 4, "substantial: a
   complete, specific answer") and templated < `PRUNE_MAX_THIN` (0.5), and not
   the same reader question as a kept page (cosine nominates, Jev decides).

Everything else gets `noindex`. Result on 2026-09-20: keep 422, noindex 971
(163 of 937 `/learn/pm/*` pages survive). Sensitivity, computed on the
probe-inclusive data before the `site:` filter landed (hence 484, not 422):

| Cut | Keep | Noindex | 90d impressions lost |
| --- | --- | --- | --- |
| value ≥ 2.0, thin < 0.5 | 785 | 608 | 4% |
| **value ≥ 2.5, thin < 0.5** | **484** | **909** | **9%** |
| value ≥ 3.0, thin < 0.5 | 121 | 1,272 | 18% |

The earlier 150–200 keep target is retired. It is not reachable without
discarding pages that have evidence or value. Value tracks evidence the model
never saw: mean value 1.99 at 0 impressions, 2.31 at 1–9, 2.36 at 10–99, 2.76
at 100+.

The prune runs in one batch, as `noindex`. A human approves the manifest and
runs `node scripts/seo-pipeline.mjs --prune`, then deploys
`seo-drafts/prune-runbook.md`. A page stays noindexed for 60 days before a
human may 410 it. A manifest built without the Jev value pass is not
executable.

## Human checklist (Monday)

1. `tail -3 ~/Library/Logs/seo-pipeline.log` shows a run from today.
2. Read the breaker line and the cluster table.
3. First Monday: approve the prune manifest and deploy the runbook.
4. When `seo-drafts/internal-links-plan.md` changed: read it, run
   `node scripts/seo/internal-links.mjs --apply`, commit.
5. Nothing else. Do not add pages by hand while the breaker is halted.

## Not automated, on purpose

- 410 responses. Noindex is reversible; 410 is not.
- Cluster creation. New clusters need a human to define the URL space.
- Anything that changes a number in `config.mjs`.
