# A retired model bypassed the whole LLM fallback chain

## The problem

Every Groq-backed call in the app (paid lesson judge, GEO publish gate, lesson generation, SEO crons) had been failing with `404 {"error":{"code":"model_not_found"}}` for `llama-3.3-70b-versatile`, and nothing fell back — despite a 5-key rotation and an OpenRouter chain built for exactly this.

## The approach

1. Noticed it indirectly: while wiring a Jev-first cascade in `src/lib/jd-parser.ts`, the Groq extraction rung failed and my `catch {}` hid it. Made the catch log (`console.error` with the message) — the 404 body appeared immediately. A silent catch would have shipped empty requirement lists forever.
2. Read the one shared entry point, `groqCreate` in `src/lib/groq.ts`: it rotates keys on `status === 429` and calls `groqCreateViaOpenRouter` only after *all* keys are rate-limited. Any other status is `throw err`. Model retirement is account-wide, so all five keys 404 and the OpenRouter chain is never reached.
3. Fixed at that function, not in callers: `status === 404`, or `400` whose message matches `/decommission|not exist|no longer/i`, now returns `groqCreateViaOpenRouter(params)` directly (no point rotating keys). One guard, all ~30 callers.
4. Confirmed the Jev rungs added the same day do not depend on this path (they only fall *back* to it), and recorded in CLAUDE.md that `OPENROUTER_API_KEY` must be set in Vercel for the remaining Groq callers to work.

## The judgment calls

- Did not upgrade the model id: which replacement Groq offers, and whether the paid Gemini models in the OpenRouter list still exist, is the owner's call and needs a key check in Vercel — not a guess in a hotfix.
- Did not add a test: exercising `groqCreate` needs the Groq SDK mocked; the guard is four lines and was verified by re-running the JD smoke, which then fell through to OpenRouter as intended.
- Left `catch {}` blocks elsewhere alone (`archive-category-map.ts`, `publish-gate.ts` fail-safe paths) — they intentionally degrade — but any new catch in this work logs its error.

## The reusable rule

A fallback chain keyed on one status code (429) is not a fallback chain; when a provider can retire a model, treat "model unavailable" as exhaustion of *every* key and jump straight to the next provider — and never swallow an upstream error in a cascade without logging it, or the cascade's first rung can be dead for months unnoticed.
