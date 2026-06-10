# Implementation Plans — PM Streak

From the 2026-06-11 audit (`docs/audits/2026-06-11-repo-audit.md`), commit `afc2a77`.
Executed in 3 bundles via isolated worktrees, integrated into one PR for the owner
to merge. **Merge only after the owner items below are done** — several fixes
fail-close on env vars that must exist in prod first.

## Execution bundles & status

| Bundle | Scope | Status |
|---|---|---|
| A — Security hardening | C2 workflow-dispatch auth, H1/H10 geo route auth, H2 centralized fail-closed `isAdmin`, H1 RevenueCat fail-close, C3 JWT fail-close, M8 unsubscribe/cron-secret fail-close | see PR |
| B — Money-path correctness | H3 credit refund on failure, H4 XP idempotency, H5 gem over-spend transaction, H6 lesson-completion transaction | see PR |
| C — Hygiene + CI + conversion | untrack env/junk + `.gitignore`, `typecheck` script, CI workflow (typecheck/test/build), DIR-01 trial-CTA default-visible, DIR-04 product-ID assertion, DOCS-01 refresh stale plan, safe `npm audit fix` | see PR |

## Owner-only — required BEFORE merging/deploying (cannot be done from the repo)

1. **Rotate** (assume compromised — in git history): Neon DB password, Dodo API key,
   `CRON_SECRET`. Update them in Vercel env.
2. **Set these env vars in Vercel** (the fail-closed code throws without them):
   `JWT_SECRET`, `ADMIN_EMAIL`, `REVENUECAT_WEBHOOK_AUTH_TOKEN`, `UNSUBSCRIBE_SECRET`,
   and all `NEXT_PUBLIC_DODO_*_PRODUCT_ID`. Confirm `JWT_SECRET` especially — if prod
   was silently running on the fallback, set it to a fresh strong value (this rotates
   all sessions).
3. **History scrub**: `.env.prod.test`/`.env.backup` are untracked by bundle C but
   remain in history — run a `git filter-repo`/BFG purge and force-push.
4. **DB migration baseline** (C4, deferred from bundles): `prisma migrate diff` to
   baseline the live schema, commit `prisma/migrations/`, switch build to
   `prisma migrate deploy && next build`. Removes the `--accept-data-loss` data-loss gun.

## Deferred (high-risk on a live app — schedule deliberately)

- **C5 major dep upgrades** — `next`, `axios`, `lodash`, `protobufjs` chain. Bundle C
  runs only non-breaking `npm audit fix`; majors need a tested upgrade pass.
- **M5 god-file refactor** (admin 1,570 / dashboard 1,074 lines).
- **M6 `paddle*` → provider-neutral column rename** — touches live subscription rows.
- **M3 event-table retention** — index first (do in the migration), prune later.
- **M4 repository layer** — only the money-path slice is in bundle B; full extraction later.
- **DIR-02 unify A/B data path**, **DIR-03 onboarding trial offer**, **DIR-05 core-loop
  hard paywall** — conversion follow-ups after DIR-01 ships and produces data.

## Findings considered and rejected

- None rejected — all 4 auditors' headline findings verified against source. Two
  agents disagreed on RevenueCat severity (one Critical, one not in scope); resolved
  as High (fail-open confirmed at `revenuecat/route.ts:16`).
