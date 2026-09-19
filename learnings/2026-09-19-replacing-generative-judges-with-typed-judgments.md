# Replacing generative JSON "judges" with typed judgments (TypeSafe Jev)

## The problem

Four places asked Llama-70B for a JSON verdict (`{"score": 0-100}`, 1–5 scores + prose, a category slug, a parsed JD), regex-extracted the JSON, and clamped whatever came back. Replace them with calibrated typed judgments without changing any caller, and know when the new judge is trustworthy.

## The approach

1. Kept every call-site contract: `judgePmAnswer → JudgeResult`, `judgeCitability → {score, reason, errored}`, `classifyEpisodeTopic → slug`, `parseJdText → JDParseResult`. New code sits behind each as the first rung; the old path is the fallback rung, selected by `isTypeSafeConfigured()` (or `JUDGE_PROVIDER=groq`).
2. Chose the primitive by what the answer means: ordered rubric → `score` with levels written as concrete situations (5 levels, 0-indexed; 1–5 = `round(position)+1`); closed set → `choice` with the descriptions as criteria; yes/no → `noul`. Everything that used to be model-authored text became code: feedback lines are *selected* from a bank keyed by which Nouls fired, skill deltas are `(score−3)×3`, JD requirement lists are verbatim clauses of the JD that Jev accepts or rejects.
3. Composed each verdict in a pure function (`composeJudgeResult`, `composeCitabilityVerdict`, `composeJdFromJev`) so vitest covers the policy with fake answers; the network call is one line around it.
4. Calibrated on real data before trusting thresholds:
   - Judge: strong / generic / off-prompt synthetic answers → 5/4/5/5, 2/4/2/2, 1/2/3/1 in ~1 s. Only wording defect found: a 5/5 answer was told "Weakest dimension: trade-offs" by the fill-in line → phrase fill-ins by score band.
   - Publish gate: the literal criterion "opening answers the title's implied question" scored every real `seo-articles/*.json` at p≈0.1, because definition-first openings are not how-to answers. Reworded to "quotable, self-contained opening" → strong articles 60/65/62, weak 46/49, synthetic fluff 5. Threshold constant untouched.
   - Dedupe: a rewritten same-intent page scored 0.67 under a 0.7 floor. For a fail-closed gate the boundary is 0.5 ("more likely duplicate than not"); verbatim copies 0.98, novel topics 0.27.
5. Verified with the repo gates: `npm test` 132/132, `npx tsc --noEmit` (no new errors), lint clean on touched files, and a live smoke per rung with `npx tsx scripts/_smoke.ts` (`@/` aliases resolve under tsx; no top-level await in cjs mode).

## The judgment calls

- No SDK: a 100-line fetch client per runtime (`src/lib/typesafe.ts` for the app, `scripts/seo/jev.mjs` for plain-node scripts) beats a dependency the repo forbids; the two are not shared because .mjs cannot import TS and the app must not import scripts/.
- Independent Nouls for pillars were replaced by one comparative `choice` per topic — every "ultimate guide" article said yes to "is this an overview?", but the Choice distribution separates them.
- Anchor/phrase selection gates on P(none), not the top option's mass: overlapping candidates spread probability without meaning uncertainty.
- Shadow replay (`scripts/judge-shadow.ts` against stored `LessonAttempt` scores) was written but not run — no `DATABASE_URL` locally. The switch defaults to Jev when the key is set; run the replay before enabling the key in prod.

## The reusable rule

When a generative model is only producing a label, a score, or a pick, replace it with a typed judgment behind the same function signature, compose the verdict in a pure function, and calibrate the *wording* of each criterion on real inputs before touching any threshold — the first literal wording usually measures something narrower than the gate's intent.
