# Deciding an autonomous SEO policy: measure the loop before trusting it

## The problem

Decide how the pmstreak SEO pipeline should run on its own, using TypeSafe Jev where a judgment is needed. The repo already had gates, a circuit breaker, cluster verdicts, a prune planner, and two cloud publishing crons — so the question looked like "which knobs to turn".

## The approach

1. Checked whether the loop was running at all before reading policy: `launchctl list | grep seo` (nothing), `ls ~/Library/LaunchAgents` (no plist), last `=== SEO pipeline run` line in `~/Library/Logs/seo-pipeline.log` (2026-07-31), `git log -1 origin/seo-rank-log` (7 weeks). Dead since July 31 while CLAUDE.md said "hourly".
2. Checked what the breaker read: `scripts/gsc-metrics.mjs` takes `sitemap.contents[].indexed` from the GSC Sitemaps API. That field has been 0 for years for everyone; the breaker had reported `0/1393` on every run and could never open. Replaced with visible% (sitemap paths with ≥1 impression / 90d).
3. Pulled raw GSC page × query rows (`scripts/seo/gsc-pages.mjs`) and looked at the top query: `site:learnanything.pro`, 668 of 2,176 impressions in 90d — the pipeline's own Google `site:` probe (`googleCheck` → `serp("site:…")`, every 6 h) counted as impressions on every indexed page. Deleted the probe; filtered `^site:` queries out of every GSC reader in one place (`gscPageQueryRows`; `gscPageRows` now aggregates from it). Visible% dropped from 15.9% to 1.7% — the honest number.
4. Checked cluster status against verdicts: `clusters.json` had three clusters `killed` on 2026-07-07 at "~0 impressions" that read 40/95/93 impressions/30d three weeks later; the loop pinned kill/freeze forever (`c.status !== "killed"`). Status now follows the latest verdict both ways.
5. Only then used Jev, for the one decision code cannot make: which zero-evidence pages to keep. Wrote `scripts/seo/page-value.mjs` (Score with five concrete levels + a "templated" Noul), calibrated on 14 pages spanning known-good and known-thin, then scored all 1,393 pages (13 s, $0.04). Mean value rose monotonically with GSC impression band (1.99 → 2.31 → 2.36 → 2.76) although the model never saw GSC — that is the validation. Computed a sensitivity table (value ≥ 2.0 / 2.5 / 3.0 → keep 785 / 484 / 121; impressions lost 4% / 9% / 18%) and picked 2.5 with thin < 0.5.
6. Made the prune reversible (`noindex`, not 410), made `executePrune` refuse a manifest built without the value pass, and wrote the policy in `docs/seo-autonomy.md` with the numbers and their derivation.

## The judgment calls

- Did not ask Jev to "decide the policy". It returns calibrated judgments over state, not strategy; the policy came from GSC numbers and a value distribution Jev produced per page.
- Did not keep the report's 150–200 keep target. The data made it unreachable without discarding pages that have evidence or value; the doc retires it rather than leaving a constant that the manifest reports as "off-target" forever.
- Did not lower the breaker floor to make publishing resume (after the prune visible% is 4%, floor 30%). A breaker that opens by fiat is not a breaker; the loop opens it when 127 of 422 kept pages earn an impression.
- Did not load the launchd job. Writing the plist and cron wrapper is reversible; starting a job that pushes to GitHub and submits to IndexNow is the owner's `launchctl load`.
- Did not touch `vercel.json`. The cloud crons that add pages with no gate are dead today (sitemap flat at 1,393 for 7 weeks) but PR #42 revives their Groq fallback — flagged as the pre-merge owner action instead of editing a production file on an unpushable branch.
- Did not build the PR automation for weekly link application. Cron plans; a human runs `--apply` and commits.

## The reusable rule

Before deciding how an autonomous loop should behave, prove three things from its own logs and raw data: that it runs, that the metric its gate reads can actually move, and that its measurements are not produced by the loop itself — then put the model's judgment only where a number cannot decide, and report the sensitivity of that judgment before picking a threshold.
