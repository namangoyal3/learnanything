# Automating contextual internal links with a judgment model (TypeSafe Jev)

## The problem

Add the "8 internal linking hacks" playbook (GSC → topics → pillars → money pages → support links → page-2 boost → footer → varied anchors) to a site whose 200 surviving pages are 137 static `src/app/<slug>/page.tsx` files with prose in const-array string literals, plus 63 markdown `Article.body` rows — without a model that writes text.

## The approach

1. Mapped where an edit can physically land before designing anything: `scripts/seo/prune-manifest.json` keep list split 137 TSX / 63 DB; static prose is rendered as `{x.field}` text nodes, so inline links need a render helper (`src/components/Linkify.tsx`), and DB bodies are markdown rendered by ReactMarkdown (a `[a](/p)` edit suffices).
2. Reused the existing pipeline modules instead of new infra: `crawl.mjs` (body-only link graph + text), `gsc-pages.mjs` (added a page×query export), `prune-manifest.json` (universe = sitemap − kill list), `config.mjs` (thresholds are policy, so they live there).
3. Called Jev over raw `fetch` (`POST https://api.typesafe.ai/v1/systemone`, `model: "jev-latest"`) with a sha1-keyed disk cache — `scripts/seo/*.mjs` is stdlib-only by design and CLAUDE.md bans new deps. Cost measured: $0.042 / 1M input tokens, a full 200-page run ≈ 0.5M tokens ≈ $0.02 warm, ~1 min.
4. Split the work into code vs. judgment. Code: candidate sentences (8–45 words, no `?`, no CTA copy), 2–5-word anchor windows that never cross punctuation or start/end on a stopword, caps (3 new links/source, 6 new inlinks/destination), anchor variation (`pickAnchor`), tolerant span matching (`&apos;`, curly quotes, whitespace) and both appliers. Jev: topic Choice, pillar Choice, relevance Noul per candidate (rerank-cookbook shape, 8 nouls in one request), sentence Choice + speculative anchor Choices for the top-3 sentences in the same request, and a final Noul "would the click deliver what the anchor promises".
5. Read the plan output after each run and fixed the systematic defects, not individual links: (a) the independent "is this an overview?" Noul scored 0.7–0.9 on nearly every "ultimate guide" page → pillar became a per-topic Choice over a shortlist (comparative primitive); the hub `/interview-prep` had scored 0.39 on the Noul because its prose is UI copy, so the floor moved from the shortlist to the Choice winner. (b) CTA lines ("Daily scenarios on X — with AI feedback") were the top sentence pick → `CTA_RE` exclusion. (c) Fragments glued across string literals ("5 rounded-full Every round…") → join prose with `\n` and split on it. (d) Anchors that describe the current page ("this complete prep guide") → explicit exclusion in the anchor instructions plus the delivers-check, which rejected 38 of 68 candidate links and kept 30.
6. Verified with the repo's own gates: `npx vitest run src/lib/__tests__/internal-links.test.ts` (14 cases incl. refusals for metadata/JSON-LD/FAQ fields), `npx tsc --noEmit` (no new errors), `npm run lint`, `npm test` (119/119), then `next dev -p 3111` + `curl` to confirm `<a href="/pm-marketplace-dynamics">` renders from a literal edit and a JSX edit.

## The judgment calls

- Not the `@typesafe-ai/sdk` — a 40-line fetch wrapper matches the stdlib-only pipeline; the SDK's only real extra (retry) is 6 lines.
- Anchors are selected, never generated: windows come from the sentence, Jev picks, code copies the span verbatim. Generated anchors would need a second review loop and could not be located in the source reliably.
- Anchor gate is P(none) ≤ 0.3, not "top phrase ≥ 0.5": 24 overlapping windows ("product discovery" / "product discovery guide" / …) spread mass across near-synonyms; the docs call that a harmless preference spread. Sentence gate keeps a top floor (0.35) because sentences are distinct.
- Not wiring `--apply` into the hourly LaunchAgent: it edits tracked TSX files, which need review + commit + deploy. Plan → review `seo-drafts/internal-links-plan.md` → `--apply` stays a human-triggered step.
- Footer applied by hand from `plan.footer` (shared chrome, ~10 links) rather than generated — and that review found `/pm-interview-cheat-sheet` linked sitewide while on the 410 kill list.
- FAQ `q`/`a` fields are refused by the applier even when Jev picks them: `faqSchema()` mirrors them into JSON-LD, where `[text](/path)` would leak.

## The reusable rule

When a judgment model must change existing text, have code enumerate the exact candidate spans, let the model only choose among them (plus `none`), and gate on P(none) when candidates overlap — then verify the assembled result with one more yes/no question before writing it.
