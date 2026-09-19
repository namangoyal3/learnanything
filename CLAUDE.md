# PM Streak (learnanything.pro) — Engineering Standards

Daily PM education platform ("Duolingo for PMs"). Every rule below is checkable: a command
that must exit 0, an exact threshold, or an observable condition. When instinct and a rule
disagree, the rule wins.

## Stack & deploy facts
- Next.js 15 (App Router) + React 19 + Prisma 6 + Tailwind 4 + Vitest. Node >= 20.9.0 (package.json engines).
- Prod: Vercel project `duolingo-for-pms`, domain https://learnanything.pro. DB: Postgres on Neon.
- Payments: Dodo Payments + RevenueCat Web Billing + Razorpay + static India UPI QR — all server logic in `src/lib/billing/`.
- Package manager: **npm**. `package-lock.json` is the only committed lockfile. Never add pnpm-lock.yaml or yarn.lock. (`pnpm tsx …` happens to work for scripts but npm is canonical.)
- 18 Vercel crons + per-route maxDurations live in `vercel.json`.

## Commands that define "passing"
- Install: `npm install`
- Types: `npx tsc --noEmit` → exit 0
- Lint: `npm run lint` → exit 0, no new warnings from your diff
- Tests: `npm test` (vitest run) → exit 0. Tests live in `src/lib/__tests__/` and beside routes (`route.test.ts`).
- Local DB: `npm run db:push` / `db:seed` / `db:studio` / `db:reset` — default to `postgresql://pmstreak:pmstreak@localhost:5432/pmstreak_dev`
- Reports: `npm run report:acquisition`, `npm run catalog:count`
- ⚠️ `npm run build` with `DATABASE_URL` set executes `prisma db push --accept-data-loss` against that DB. Vercel runs the same on deploy — schema edits go live (and can drop columns) when a deploy builds. Never point a local build at prod.

## Hard blocks — never do these
1. **PR #28** (`advisor/audit-remediation`) is OPEN and must NOT be merged until the owner: rotates Neon DB password, Dodo API key, `CRON_SECRET`; sets `JWT_SECRET`, `ADMIN_EMAIL`, `REVENUECAT_WEBHOOK_AUTH_TOKEN`, `UNSUBSCRIBE_SECRET`, `NEXT_PUBLIC_DODO_*_PRODUCT_ID` in Vercel; scrubs `.env.prod.test` / `.env.backup` from git history. Verify status: `gh pr view 28`.
2. `.env.local`, `.env.backup`, `.env.prod.test` on disk contain real secrets. Never print their values, never commit anything matching `.env*`.
   - 2026-09-20: local history was rewritten (git filter-repo) to drop `.env.backup`, `.env.prod.test`, `scripts/virtual-company/service_account.json` and five pasted Groq keys before `seo-v2` / `seo/internal-links-jev` were pushed; none of it ever reached GitHub. Pre-scrub bundle: `~/.cache/pmstreak-backups/`. Rotate the Groq keys and `CRON_SECRET` regardless.
3. Never commit `scripts/virtual-company/service_account.json` or `scripts/seo-rank-history.json` (gitignored; the service account leaked once already).
4. Never write directly into `seo-articles/`. Forge writes drafts to `seo-drafts/<slug>.mdx`; Signal opens PRs from there.
5. Anchor agent never auto-sends. Drafts only.
6. Agent tool routes never use raw SQL or the Prisma client directly — only allowlisted helpers in `src/lib/geo/safe-prisma.ts`.
7. Never log payment tokens, credentials, or full API keys. Never create a `NEXT_PUBLIC_`-prefixed secret; check `git diff | grep -E '^\+.*NEXT_PUBLIC_.*(KEY|SECRET|TOKEN)'` — only documented public SDK keys (RevenueCat public key, Razorpay key id, GA/PostHog ids) may match.

## Definition of done

### Any code change
- [ ] `npx tsc --noEmit` exit 0
- [ ] `npm run lint` exit 0
- [ ] `npm test` exit 0
- [ ] `git diff --stat` names ≤5 non-test files for one logical change — otherwise split the PR
- [ ] No new dependency unless the feature is impossible with existing deps (zod, cheerio, framer-motion, groq-sdk, resend, nodemailer, playwright are already in package.json)
- [ ] Nothing staged matches: `git diff --cached | grep -inE 'api[_-]?key|secret|password|token *[:=]'` (allow test fixtures only)

### Feature
- Everything above, plus:
- [ ] PR title says what changed; body says what user problem it solves
- [ ] Happy path + one edge case exercised (state which, and how, in the PR body)
- [ ] If it renders UI: load the affected page locally, zero new browser-console errors
- [ ] If it touches `prisma/schema.prisma`: PR body lists affected columns/data and confirms the change is additive (build runs `db push --accept-data-loss` — see above)

### Fix
- [ ] Reproduce first: a command, curl, or test that fails before the fix
- [ ] A test now covers it: the new/updated test fails on the old code, passes on the new
- [ ] Fix the implementation, not the test (unless the test asserted wrong behavior — say so in the PR)

### Payments / auth / entitlements
- [ ] Only files under `src/lib/billing/`, `src/app/api/checkout/`, `src/app/api/webhooks/` grant or modify entitlements
- [ ] `npx vitest run src/app/api/webhooks/dodo-payments/route.test.ts src/lib/__tests__/razorpay-server.test.ts src/lib/__tests__/lesson-access.test.ts` → exit 0
- [ ] Missing secret ⇒ route throws / returns 4xx-5xx. It never silently succeeds (fail closed)
- [ ] Trial-logic changes tested with a freshly created user account (freemium → trial → paid)
- [ ] PR body explains what changed and why, file by file

### SEO / content change
- [ ] Article JSON goes in `seo-articles/*.json`; publish with `npx tsx scripts/publish-seo-articles.ts` (needs `DATABASE_URL`) — it rejects anything scoring < 70 via `scoreSEO`
- [ ] Passages target 134–167 words each (max score band in `src/lib/seo-score.ts`)
- [ ] GEO pages must clear `CITABILITY_THRESHOLD = 70` (`src/lib/geo/citability.ts`). Raising content quality is the fix; editing the constant is not
- [ ] Bulk article text is committed ONLY under `seo-articles/`, `seo-drafts/`, `scripts/seo-output/`, or `graphify-out/cache/`
- [ ] Static marketing/SEO pages are literal directories `src/app/<slug>/page.tsx` — there is NO dynamic `[slug]` route
- [ ] New page exports `metadata` with title + description and a canonical URL
- [ ] Internal links (hacks 1–8 of the linking playbook): `node scripts/seo/internal-links.mjs` writes the working list to `seo-drafts/internal-links-plan.md`; review it, then `--apply` edits `src/app/<slug>/page.tsx` / `Article.body` and records `scripts/seo/internal-links-ledger.json`. Needs `TYPESAFE_API_KEY`; GSC creds optional. Footer pillars (`SiteFooter.tsx`) are applied by hand from `plan.footer`

### GEO agent change
- [ ] Spec lives in `src/agents/<agent>/spec.ts` (conductor + 9 workers incl. retrofit). Deploy: `/lyzr-deploy <agent>` slash command
- [ ] Smoke passes: `npx tsx scripts/lyzr/smoke.ts <agent>`
- [ ] KB attached before real calls: `npx tsx scripts/lyzr/attach-kb.ts` (helper: `src/lib/geo/kb-attach.ts`)
- [ ] New tool route under `src/app/api/geo/tools/*`: Zod-validates every input, checks `CRON_SECRET`, uses `safe-prisma.ts` only
- [ ] Any new cron/long route is registered in `vercel.json` (crons array + functions maxDuration), else it times out at the default

## Quality bar — the 5 rules a hurried change most often breaks
1. **Money paths fail closed.** No entitlement/credit write outside `src/lib/billing/` + webhook/checkout routes; absent env secret ⇒ error, never a free grant. Proof: the payments test files above pass.
2. **Gates are constants, not suggestions.** Citability ≥ 70, SEO score ≥ 70, passages 134–167 words. If content fails, improve the content — never touch the threshold.
3. **Agents are sandboxed.** Every `api/geo/tools/*` route has all three: Zod input validation, `CRON_SECRET` auth, `safe-prisma.ts` data access. Missing any one = do not ship.
4. **A deploy is a schema migration.** Vercel build runs `prisma db push --accept-data-loss`. Treat every `schema.prisma` diff as a prod migration and call it out explicitly in the PR.
5. **Surgical diffs.** Don't refactor adjacent code, don't reformat untouched files, ≤5 non-test files per logical change, copy existing repo patterns before importing new abstractions.

## Environment
Full annotated list: `.env.example`. Non-obvious:
- `CRON_SECRET` — required by every GEO cron/tool endpoint
- `LYZR_API_KEY` (server-only, never logged), `LYZR_CONDUCTOR_ID`, `LYZR_AGENT_*` — agent IDs come ONLY from env; never hardcode an ID in `src/lib/lyzr.ts` or specs
- `GEO_REVIEW_SAMPLE_EVERY` (default 4: every Nth auto-publishable article held for human review), `GEO_CREATE_DAILY_QUOTA` (default 5), `GEO_PROBE_DAILY_LIMIT` (default 10)
- `PERPLEXITY_API_KEY` — enables the daily AI-citation probe; without it the cron logs "unconfigured" and exits (that is expected, not a bug)
- `INDEXNOW_KEY` — key value must also be served at `public/{key}.txt`
- `GA4_PROPERTY_ID` / `GA4_SERVICE_ACCOUNT_KEY` / `GSC_SITE_URL` — Pulse analytics; setup in `docs/GSC_SETUP.md`
- `TYPESAFE_API_KEY` — enables the Jev (TypeSafe System One) rung in `src/lib/ai-judge-jev.ts`, `src/lib/geo/publish-gate.ts`, `archive-category-map.ts`, `jd-parser.ts` and `scripts/seo/{internal-links,gates,prune}.mjs`; without it every path falls back to Groq/heuristics. `JUDGE_PROVIDER=groq` pins the old judge. Before trusting the judge switch in prod: `npx tsx scripts/judge-shadow.ts` (needs `DATABASE_URL`)
- ⚠️ Groq retired `llama-3.3-70b-versatile` (404 `model_not_found`, 2026-09-19). `groqCreate` now routes that to the OpenRouter chain, which needs `OPENROUTER_API_KEY` in Vercel — verify it is set, or every remaining Groq caller (lesson generation, GEO crons) fails

## Local SEO pipeline (runs on the owner's Mac, not in cloud)
- Policy: `docs/seo-autonomy.md` (decided 2026-09-20). Numbers: `scripts/seo/config.mjs`. The loop shrinks and measures; publishing is gated by the breaker (visible% ≥ 30, today 1.7%).
- launchd job `pro.learnanything.seo-pipeline` fires **daily at 07:07** → `~/Library/Scripts/seo-pipeline-cron.sh` → `node scripts/seo-pipeline.mjs --no-ranks` (Sunday `--vanity` rank scrape; Monday `--prune-plan` + `scripts/seo/internal-links.mjs` plan); log: `~/Library/Logs/seo-pipeline.log`. The job was missing from 2026-07-31 to 2026-09-20; the plist is in `~/Library/LaunchAgents/`.
- One cycle: fetch live sitemap → IndexNow only when the URL set changed → GSC page × query rows with `site:` probe queries dropped (they were 74% of Jul–Aug impressions) → breaker on visible% → cluster verdicts (status follows the latest verdict, both ways) → append `scripts/seo-rank-history.json` → push history to the `seo-rank-log` branch
- Never pass `--google` from cron: its `site:` probe is what polluted GSC. The Sitemaps API `indexed` count is dead (0 forever) — do not gate on it.
- Prune: `--prune-plan` writes `scripts/seo/prune-manifest.json` (Jev page-value + same-intent judgments; action `noindex`, reversible). `--prune` is human-only and refuses a manifest built without the value pass. 410 is a later human step (60 days after noindex).
- Health check: `tail -5 ~/Library/Logs/seo-pipeline.log` shows a run from today, and `git log origin/seo-rank-log -1 --format=%cr` is recent
- ⚠️ Cloud crons `/api/cron/generate-seo` and `/api/geo/create/tick` add pages with no portfolio gate; remove them from `vercel.json` before PR #42 merges (it repairs the Groq fallback they died on)

## Image generation
- Lyzr tool route `POST /api/geo/tools/image-gen` wraps the `nanaban` CLI (GPT Image via Codex OAuth / Nano Banana)
- `nanaban` is NOT currently on PATH (`which nanaban` fails). Before image work: `npm install -g nanaban`, then `codex login`, then `nanaban auth` (install flow unverified)

## Data model (prisma/schema.prisma — 39 models)
- Money: `User` (plan, credits, streak, xp), `Subscription`, `BillingEvent`, `Entitlement`, `Coupon`/`CouponAttempt`, `CreditTransaction`, `CountryPriceOverride`
- Learning: `Lesson`, `Question`, `Category`, `CompletedLesson`, `QuizAttempt`, `StreakDay`, `Achievement`, `LearningPlan`
- SEO/GEO: `Article`, `SeoKeyword`, `ArticleLead`, `GeoOpportunity`, `GeoPageMetric`, `GeoCitation`, `GeoPageTriage`, `GeoCronLog`
- Experiments: `ExperimentEvent`, keyed by the `ab_uid` cookie that `src/middleware.ts` assigns (90-day, httpOnly) — middleware does A/B identity, not auth
- There is no `SeoArticle` and no `CheckoutSession` model (older docs claimed both)

## File conventions (verified paths)
- API routes: `src/app/api/<feature>/route.ts` · crons: `src/app/api/cron/<job>/route.ts` · GEO runs: `src/app/api/geo/<agent>/run/route.ts` · GEO tools: `src/app/api/geo/tools/*`
- Server actions: `src/app/<page>/actions.ts` · components: `src/components/<FeatureName>.tsx` · path alias `@/*` → `./src/*`
- Lyzr client: `src/lib/lyzr.ts` — all agent calls via `callAgent(agentId, message, sessionId)` or `callConductor(message, sessionId)`
- `/job-outreach` is a static page `public/job-outreach/index.html` served through a rewrite in `next.config.ts`; its form posts to `/api/leads/article-signup`
- Docs: `docs/geo-architecture.md` (swarm design), `docs/geo-tech-spec.md`, `docs/ANALYTICS.md`, `docs/GSC_SETUP.md`
- Slash commands in `.claude/commands/`: `/forge-page <topic>`, `/lyzr-deploy <agent>`, `/pulse-snapshot`

## Product context
- Conversion is the #1 metric. Before shipping anything user-facing, open `/pricing` and `/dashboard` locally and confirm the flows still work with zero console errors. Checkout flow: freemium → trial → paid.
