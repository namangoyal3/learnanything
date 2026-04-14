# CLAUDE.md — PM Streak

## Design System
Always read `DESIGN.md` before making any visual or UI decisions.
All font choices, colors, spacing, and aesthetic direction are defined there.
Do not deviate without explicit user approval.
In QA mode, flag any code that doesn't match DESIGN.md.

Key rules:
- Only two saturated colors in the palette: green `#58cc02` and purple `#ce82ff`. Never introduce a third.
- Surfaces must use `--bg-primary/-secondary/-card` variables — no hardcoded hex, no blue-teal.
- Typography: DIN Round Pro → Nunito → system-ui. `font-black` for all headings. Never `font-medium` on H1/H2.
- Section H2s are `text-4xl sm:text-5xl`. Not `text-3xl`.

## SEO content
- `/learn` routes serve AI-generated articles from the `Article` Prisma model.
- Generation pipeline: `src/app/api/cron/generate-seo/route.ts` + `scripts/generate-seo-batch.ts`.
- Keyword queue: `SeoKeyword` table, status machine `pending → mapping → generated | failed`.
- Requires `GROQ_API_KEY` (primary) or `OPENROUTER_API_KEY` (fallback) in `.env.local`.

## Auth
Custom JWT (not next-auth). `src/lib/auth.ts` exports `getCurrentUserId()`.
Sign-up route is `/signup`, not `/auth/signup`.

## Tech
- Next.js 15 App Router, Prisma + Neon Postgres, Tailwind v4, hosted on Vercel.
- Run `npm run build` before deploying — the pipeline is strict on TS errors.
