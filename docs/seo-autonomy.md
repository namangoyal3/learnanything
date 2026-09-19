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
(30%). Visible% today: 1.7%. After the prune below: 2.9%. The breaker opens when
226 of the 751 kept pages receive an impression in a 90-day window. That is
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
3. Core route (product surface, hubs, legal, app pages).
4. Body-linked from a merit-kept page with ≤ 25 body links.
5. Value pass. A generated page (`/learn/pm/*`, AI-written) stays when its
   Jev value ≥ `PRUNE_MIN_VALUE` (2 of 4, "usable: at least one specific
   element"). A hand-built page stays regardless; below the line it goes on
   the manifest's `rewrite` list. Either kind is noindexed when it answers the
   same reader question as a kept page (cosine nominates, Jev decides ≥ 0.5).

Everything else gets `noindex`. Result on 2026-09-20: keep 751, noindex 642
(631 generated pages; 11 hand-built duplicates, each naming its kept twin),
rewrite 9. Sensitivity, computed before the cut on probe-inclusive data:

| Cut | Keep | Noindex | 90d impressions lost |
| --- | --- | --- | --- |
| **value ≥ 2.0** | **785** | **608** | **4%** |
| value ≥ 2.5 | 484 | 909 | 9% |
| value ≥ 3.0 | 121 | 1,272 | 18% |

The line sits on a level boundary, not a midpoint. A first cut at 2.5 put 147
hand-built guides on the noindex list by a ±0.3 margin the Score cannot
resolve, and contradicted 6 of the 19 internal-link destinations placed the
day before. The "templated" probability is recorded, not cut on: it flagged
checklists and cheat sheets (`/pm-interview-cheat-sheet`, value 3.49), not
swapped-title pages.

The earlier 150–200 keep target is retired. It is not reachable without
discarding pages that have evidence or value. Value tracks evidence the model
never saw: mean value 1.99 at 0 impressions, 2.31 at 1–9, 2.36 at 10–99, 2.76
at 100+.

The prune ships as `noindex`: `src/middleware.ts` sets `X-Robots-Tag` for
every path in `src/data/pruned-urls.json`, `src/app/sitemap.ts` omits them,
and `/sitemap-removed.xml` lists them for Search Console. A page stays
noindexed for 60 days before a human may 410 it. A manifest built without
the Jev value pass is not executable.

## Human checklist (Monday)

1. `tail -3 ~/Library/Logs/seo-pipeline.log` shows a run from today.
2. Read the breaker line and the cluster table.
3. First Monday: submit `/sitemap-removed.xml` in Search Console; read the
   manifest's `rewrite` list.
4. When `seo-drafts/internal-links-plan.md` changed: read it, run
   `node scripts/seo/internal-links.mjs --apply`, commit.
5. Nothing else. Do not add pages by hand while the breaker is halted.

## Not automated, on purpose

- 410 responses. Noindex is reversible; 410 is not.
- Cluster creation. New clusters need a human to define the URL space.
- Anything that changes a number in `config.mjs`.
