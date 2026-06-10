# PM Streak — Repo Audit & Improvement Plan

Date: 2026-06-11 · Commit: `afc2a77` · Method: 4 parallel auditors (security/deps,
architecture/correctness, perf/db/dx, tests/docs/direction), findings deduped and
each headline item re-verified against source by the synthesizer. Read-only audit.

Secrets policy: where credentials were found, this report names the file and
credential **type** only — never a value — and recommends rotation.

---

## Executive Summary

**Overall health: C.** PM Streak is a capable, mature app (~104K LOC, 102 API
routes, 38 Prisma models, multi-provider payments) with genuinely solid
foundations — verified webhook signatures, atomic credit transactions, a
defensive entitlement-reconciliation layer, strict TypeScript with near-zero
escape hatches. But the security and correctness debt sits squarely on the
money path and the deploy pipeline, and unlike learnanything-pro this app has
real users, a real production database, and live payment keys, so the exposure
is real, not theoretical. **Top 3 risks:** (1) production credentials are
committed to the repo (`.env.prod.test`, `.env.backup` — tracked, in history)
and an unauthenticated admin route dispatches a GitHub Actions workflow with the
server token; (2) `prisma db push --accept-data-loss` runs on every production
deploy with no migration history — one schema rename silently drops prod data;
(3) 42 production dependency vulnerabilities including a `protobufjs` RCE, plus
several money-path correctness bugs (credits burned on generation failure with
no refund, farmable XP, a gem over-spend race). **Top 3 opportunities:** (1) the
conversion funnel's headline lever is dark — the pricing trial CTA renders
nothing for first-time visitors (`ab.ts` defaults unassigned traffic to a
control that shows no offer); (2) the funnel instrumentation the stale
CONVERSION_PLAN.md calls "missing" has actually shipped, so you can optimize on
real data today; (3) a one-day CI + migration + hygiene pass converts strong
local discipline into enforced discipline and removes the deploy-time data-loss
gun.

---

## Repo Map

**Purpose:** "Duolingo for PMs" — daily AI-generated micro-lessons, freemium
(free tier → 7-day Pro trial → paid via Dodo/Razorpay/RevenueCat/UPI), plus a
large autonomous GEO/SEO content swarm. CLAUDE.md names **0% conversion** as the
critical business problem. Maturity: production, live users + payments.

**Stack:** Next.js 15 App Router · TS strict · Prisma 6 + Neon Postgres ·
npm · vitest · Vercel (9 crons + GEO workflows) · payments (Dodo primary).

| Area | Role |
| --- | --- |
| `src/app/api/*` (102 routes) | Integrations + writes; Prisma imported directly in 64/102 |
| `src/lib/billing/*`, `entitlements.ts`, `credits.ts` | Payment + Pro-access + credit economy (the money path) |
| `src/lib/lesson-generator.ts`, `llm-lessons.ts` | AI lesson pipeline (Lenny MCP + LLM) |
| `src/lib/geo/*`, `src/agents/*` | Lyzr-backed GEO content swarm + queue tables |
| `src/app/api/cron/*` (9) | Email, scraping, credit-refresh, ingestion |
| `prisma/schema.prisma` | 38 models; no `migrations/` dir |
| `middleware.ts` | A/B uid cookie — only on `/` and `/pricing` |

**Data flow:** route → `getCurrentUserId()` (JWT cookie) → `lib/` → Prisma →
Postgres. Webhooks mutate `User.plan`/`Entitlement`/`Subscription`;
`reconcileExpiredProAccess` is the read-time safety net.

**Surprises:** prod creds committed; `db push --accept-data-loss` is the build
command; two parallel A/B systems that don't share data; CONVERSION_PLAN.md is
stale (calls shipped instrumentation "broken"); 7 test files for 104K LOC.

---

## Audit Report

### Critical

| # | Finding | Where | Consequence | Type |
| --- | --- | --- | --- | --- |
| C1 | Production credentials committed (DB password, Dodo key, CRON_SECRET) | `.env.prod.test`, `.env.backup` (tracked, in history; `.gitignore` misses these variants) | Anyone with repo access gets prod DB + payment keys; persists in history. Repo is private, which bounds but does not remove the risk | FACT |
| C2 | Unauthenticated GitHub workflow-dispatch | `src/app/api/admin/ai-company/route.ts` (+ `/logs`, `/runs`) — no `isAdmin`/auth, POSTs workflow dispatch with server `GITHUB_TOKEN` | Any anonymous caller triggers the "AI board meeting" CI run with attacker-controlled `directive`; reads internal run logs; burns Actions + AI spend | FACT (verified) |
| C3 | JWT secret hardcoded fallback | `src/lib/auth.ts:5` — `JWT_SECRET \|\| "pm-streak-secret-key-change-in-production"`; same secret signs password-reset tokens | If the env var is ever unset (a preview/staging inheriting no secrets), anyone forges a session for any userId incl. admin/Pro. No startup guard | FACT (verified) |
| C4 | `prisma db push --accept-data-loss` on every deploy; no migration history | `package.json` build script; `prisma/migrations/` absent | A schema field rename/removal silently drops production columns/tables on next deploy. No rollback | FACT (verified) |
| C5 | 42 prod dependency vulns (1 critical, 14 high) | `npm audit --omit=dev`: `protobufjs` RCE, `axios` SSRF + proto-pollution, `next` CVEs, `lodash`, `tar`, `undici` | RCE-class transitive deps; SSRF directly relevant given outbound scraping/firecrawl/Dodo calls | FACT |

### High

| # | Finding | Where | Consequence | Type |
| --- | --- | --- | --- | --- |
| H1 | RevenueCat webhook fails open | `src/app/api/billing/webhook/revenuecat/route.ts:16` — auth skipped entirely if token env unset | Anonymous POST grants entitlements to a chosen userId | FACT (verified) |
| H2 | Admin email hardcoded fallback | 8–10 files under `src/app/api/admin/*` — `ADMIN_EMAIL \|\| "namango…@gmail.com"` | If env unset, whoever registers that email is admin; PII in source | FACT (verified, 10 files) |
| H3 | Credits spent before generation, never refunded on failure | `src/lib/lesson-generator.ts:254` spend → `:279` LLM call can throw; route catch (`generate-lesson/route.ts:29`) does not refund | Every upstream LLM/MCP hiccup silently burns 2 paid credits, no lesson delivered | FACT (verified) |
| H4 | XP awarded on every re-submit of a completed lesson | `lessons/[id]/complete/route.ts` — gems gated by `if (!existing)` but `recordLessonCompletion(userId, totalXP)` runs unconditionally | Client farms unbounded XP/level by re-POSTing; corrupts leaderboard | FACT (verified) |
| H5 | Gem/streak-freeze over-spend race (check-then-act, no tx) | `src/app/api/shop/route.ts:21-60`; same shape in `user/streak-freeze` | Concurrent requests both pass balance check → negative balance | FACT (verified) |
| H6 | Lesson-completion writes not transactional | `lessons/[id]/complete/route.ts:57-125` — ~6 independent writes | Mid-failure leaves partial state (gems but no completion, etc.) | FACT |
| H7 | Dodo webhook can drop a paid customer | `webhooks/dodo-payments/route.ts:131-241` — event row written before grant; grant failure → 500, Dodo retry deduped, grant never re-runs | Customer pays, stays free | JUDGMENT (depends on retry semantics) |
| H8 | Password-reset tokens replayable; reset→30-day session | `src/lib/auth.ts:29-51` stateless JWT, no `jti`/single-use; `password-reset/login` mints full session | An observed reset link works repeatedly for 30 min | FACT |
| H9 | No rate limiting on auth | `auth/login/route.ts`, `auth/password-reset/request` — middleware only on `/`,`/pricing` | Unlimited password guessing / reset-email abuse | FACT |
| H10 | Unauthenticated geo info-leak | `geo/health/route.ts`, `geo/logs/route.ts` | Leaks which secrets are set, Lyzr agent IDs, cron logs | FACT |
| H11 | `x-vercel-cron: 1` spoofable bypass on 8 geo routes | `isAllowed` accepts the header as auth | Anyone triggers 120–300s AI runs, burns credits | JUDGMENT (Vercel infra may block on ingress — verify) |
| H12 | Money path grant/revoke + atomic credits untested; no auth/integration/e2e | 7 test files / 104K LOC; webhook test mocks the granter | Revenue-path regressions ship green | FACT |
| H13 | No CI build/test/typecheck gate | `.github/workflows/` has only GEO automation | Type errors / failing tests reach main + deploy | FACT |

### Medium

- **M1** Cron N+1 / sequential / unbounded `findMany` (no `take`): `daily-emails` (re-queries a constant lesson per user, `:80`), `scrape-jobs`/`linkedin-jobs` (per-job `findFirst`), `ingest-leader-content` (per-question insert), `refresh-credits` (`isUserPro` per user). Timeout → silent half-processing. FACT
- **M2** Missing indexes on growing tables: `Job.applyUrl` (also the dedup filter — should be `@unique`), `QuizAttempt`, `Notification`, `FriendChallenge`, `Question.lessonId`, `GeoCitation`. FACT
- **M3** Unbounded event tables, no retention: `ExperimentEvent`, `LessonAttempt`, `QuizAttempt`, `EmailLog`, `GeoCronLog`. FACT
- **M4** No data-access layer — Prisma in 64/102 routes; entitlement/credit invariants re-implemented ad hoc (root of H5/H6). FACT
- **M5** God files: `admin/page.tsx` (1,570 lines), `dashboard/page.tsx` (1,074) — exceed the project's own 800-line rule. FACT
- **M6** Legacy `paddle*` column names now hold Razorpay/Dodo IDs (`razorpay-server.ts`, `dodo-payments/route.ts:18`) — schema names lie. FACT
- **M7** Silent catches in GEO pipeline (`forge-runner.ts:179`, `safe-prisma.ts` warn-only). MED
- **M8** `CRON_SECRET`/`UNSUBSCRIBE_SECRET` fall open / use published fallback when env unset. FACT
- **M9** Committed build/scratch artifacts: `graphify-out/cache/` (242 files), `seo-drafts/`, `article{1,2,3}.json`, `.graphify_ast.json` (447KB), `nohup.out`, `vercel_local_build.log`, `local-screenshots/` — none gitignored; violates CLAUDE.md's own "never commit article content". FACT
- **M10** No `typecheck` script; `scripts/` excluded from tsconfig; build couples `prisma db push` to compilation (can't build without a DB). FACT

### Low

- middleware A/B cookie only on `/` + `/pricing` → attribution gaps. · In-memory geo tool caches lost on cold start (no cross-invocation protection). · No README; CLAUDE.md says pnpm but lockfile is npm. · `checkout` allows anonymous product-ID probing.

### Strengths (preserve)

- Dodo **and** Razorpay webhook signatures verified (Razorpay uses `timingSafeEqual`), idempotent via `BillingEvent.externalId` P2002 dedup, fail-closed on missing webhook secret.
- `credits.ts:spendCredits` is the correctness model: real `$transaction` check-and-decrement (the pattern H5/H6 should adopt).
- Zero raw SQL anywhere — no injection surface. Entitlement reconciliation read-time safety net. Coupon ownership validated against session email.
- TS strict, ~11 `as any`, 0 `@ts-ignore`. Good indexes/unique constraints where they exist. Heavy work correctly pushed to budgeted crons. Webhook idempotency is tested.

---

## Direction findings (conversion funnel — evidence-grounded)

- **DIR-01 — The trial CTA is invisible to first-time visitors.** `src/lib/ab.ts:20`
  returns `"control"` whenever the `ab_uid` cookie is absent, and middleware sets
  that cookie on the *response*, so it's unreadable on first load;
  `PricingPageTrialCTA` renders `null` for control. Most cold SEO traffic landing
  on `/pricing` sees no trial offer at all. Making treatment the default for
  unassigned traffic (or assigning at the edge before render) is a small change
  on the headline conversion lever. **Highest-leverage direction item.**
- **DIR-02 — Two A/B systems that don't talk.** `experiment-tracker.ts` (DB-backed
  `ExperimentEvent`) is referenced only by admin label text; live experiments use
  the cookie-only `ab.ts`, which never writes `ExperimentEvent`. You can run tests
  but the admin "experiment stats" view has no server-side data to trust.
- **DIR-03 — Onboarding wastes peak intent.** `onboarding/page.tsx` builds real
  commitment (goal, pace, "Commit to My Goal") then drops the user on the dashboard
  with no trial/Pro framing. A soft trial offer at the "ready" step is an
  architecture-ready lever.
- **DIR-04 — Checkout silently dies if a product ID is unset.** `pricing/page.tsx:310`
  falls back to `href="#comparison"` when a `productId` is falsy, so a misconfigured
  `NEXT_PUBLIC_DODO_*_PRODUCT_ID` renders a buy button that scrolls instead of
  checking out — a 100% silent conversion loss. A build/health assertion turns it loud.
- **DIR-05 — Hard paywall only in `/explore`, not the core loop.** The 402 hard stop
  works in AI Explore; the main daily-lesson gate just shows fewer cards. Extending a
  contextual hard-stop to the core flow at the free limit is the adjacent lever.
- **DOCS-01 — CONVERSION_PLAN.md is stale and misleading.** It lists GA4 events,
  trial visibility, and homepage CTA as "P0-BROKEN," but all three shipped
  (`ga4-server`, `start-trial`, `HomepageTrialButton`). Acting on it re-builds done
  work and hides the real gaps above.

---

## Improvement Strategy

**Theme 1 — Close the live exposure.** Rotate the committed credentials, gate the
workflow-dispatch route, fail-closed every auth fallback (JWT, RevenueCat, admin
email, cron/unsubscribe secrets), untrack the env files. Principle: a private repo
is not an access-control strategy. Done = no published-secret fallback, no
unauthenticated privileged route, secrets rotated.

**Theme 2 — Make deploys safe.** Replace `db push --accept-data-loss` with a
migration baseline + `migrate deploy`; add a CI gate (typecheck/test/build). Done =
no `--accept-data-loss` in build, `prisma/migrations/` exists, CI red-X's a broken PR.

**Theme 3 — Fix the money path.** Refund credits on generation failure, make XP
idempotent, make gem-spend and lesson-completion transactional (adopt the
`spendCredits` pattern), and test grant/revoke. Done = those paths transactional +
covered.

**Theme 4 — Unblock conversion.** Make the trial CTA default-visible (DIR-01),
unify the A/B data path (DIR-02), assert product IDs at build (DIR-04), refresh the
stale doc. Done = first-touch visitors see the offer; experiment readouts have data.

**Explicitly deferring:** god-file refactors (M5), the full repository-layer
extraction (M4 — do the money-path slice only), GEO silent-catch cleanup (M7), event
retention (M3 — index first, prune later), the `paddle*` rename (M6 — migration risk
on live data, schedule deliberately).

---

## Task Plan → see `plans/`

Milestones: **M0 safety net** (CI gate, untrack env+junk, migration baseline) ·
**M1 criticals** (workflow-dispatch auth, fail-closed secrets, dep upgrades, rotate)
· **M2 money path** (refund, XP idempotency, transactions, tests) · **M3 conversion**
(DIR-01 CTA, DIR-04 assertion, doc refresh).

**Owner-only (cannot be done from the repo):** rotate Neon DB password + Dodo API
key + CRON_SECRET in their dashboards; set the now-required env vars in Vercel
(`JWT_SECRET`, `ADMIN_EMAIL`, `REVENUECAT_WEBHOOK_AUTH_TOKEN`, product IDs); run the
Prisma migration baseline against the live DB; force-push a history scrub (e.g.
`git filter-repo`) to purge the committed secrets from history; confirm whether
Vercel infra blocks `x-vercel-cron` on public ingress (H11).

## Open Questions

1. Is this app keeping learnanything.pro, or moving to its own domain? (Cross-repo
   decision still open — pm-streak currently occupies the domain.)
2. Migration baseline: OK to generate against the live schema and switch the build to
   `migrate deploy`? (Needs a one-time `prisma migrate diff` baseline.)
3. `x-vercel-cron` (H11): is the Vercel plan's ingress protection confirmed?
4. The `paddle*` → provider-neutral rename (M6): schedule it, given it touches live
   subscription rows?
