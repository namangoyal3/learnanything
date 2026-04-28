# pm-streak

Duolingo for PMs — a Next.js / Prisma / Vercel app for product management upskilling.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL (Neon) via Prisma 6
- **Hosting:** Vercel
- **Payments:** Paddle (global), Razorpay (India), UPI QR
- **AI:** Groq SDK for lesson generation
- **Analytics:** GA4, PostHog

## Conventions

- Path alias: `@/*` maps to `./src/*`
- Package manager: `pnpm` (or `npm` fallback)
- All API routes live under `src/app/api/`
- Cron handlers live under `src/app/api/cron/` and `src/app/api/geo/`
- SEO articles: `seo-articles/` (published), `seo-drafts/` (drafts)
- Scripts excluded from tsconfig compilation (in `scripts/`)

## GEO Swarm (Lyzr-backed)

This repo deploys 8 GEO agents on Lyzr Agent Studio, orchestrated by a Conductor managerial agent. Full design: `docs/geo-architecture.md`. Tech spec: `docs/geo-tech-spec.md`.

### Conventions
- Lyzr client: `src/lib/lyzr.ts`. All agent calls go through `callAgent(agentId, message, sessionId)` or `callConductor(message, sessionId)`.
- Agent IDs come from `process.env.LYZR_AGENT_*` and `LYZR_CONDUCTOR_ID` — never hardcode.
- API routes that Lyzr tools call live under `src/app/api/geo/tools/*`. Validate every input with Zod.
- Forge writes drafts to `seo-drafts/<slug>.mdx`; Signal opens PRs from there. Never write directly to `seo-articles/`.
- Citability gate ≥70 enforced in `src/lib/geo/citability.ts`. Don't bypass.
- All Prisma access from agent tool routes goes through allowlisted helpers in `src/lib/geo/safe-prisma.ts`. No raw SQL from agents.

### Hard rules
- Anchor never auto-sends. Drafts only.
- Lyzr API key is server-only. Never `NEXT_PUBLIC_*`. Never echo in logs.
- KB attachment is required on every agent before calling it for real. See `src/lib/geo/kb-attach.ts`.

### Useful commands
- `pnpm tsx scripts/lyzr/attach-kb.ts` — bulk-attach the shared KB to all 9 agents.
- `pnpm tsx scripts/lyzr/seed-kb.ts` — Cortex bootstrap from repo files.
- `pnpm tsx scripts/lyzr/smoke.ts <agent>` — smoke test an agent.
- `/forge-page <topic>` — Claude Code slash command to forge a draft locally.
- `/lyzr-deploy <agent>` — push that agent's spec from `src/agents/*/spec.ts` to Lyzr.
- `/pulse-snapshot` — manual Pulse run + analyst review.
