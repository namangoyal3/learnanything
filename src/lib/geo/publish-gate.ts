// publish-gate.ts — decides whether a gate-passing article auto-publishes or is
// held as an unpublished draft for human review (GEO-01 + GEO-03).
//
// Two inputs beyond the regex citability score:
//  1. LLM judge (GEO-01): scores extractable-answer quality — direct-answer-first
//     opening and self-contained H2 sections — beyond regex signal presence.
//  2. Review sample (GEO-03): every Nth auto-publishable article is held anyway,
//     so a human sees a steady sample of what the swarm ships.
//
// Fail-safe: a judge API failure NEVER blocks creation and NEVER auto-publishes —
// the article is created as a draft for review.

import { groqCreate } from "@/lib/groq";
import { isTypeSafeConfigured, noul, systemOne, type Answers } from "@/lib/typesafe";
import { canAutoMerge } from "./citability";

export const JUDGE_PASS_THRESHOLD = 60;
const DEFAULT_REVIEW_SAMPLE_EVERY = 4;

export type JudgeVerdict = {
  score: number; // 0-100; 0 when errored
  reason: string;
  errored: boolean;
};

export type PublishDecision = {
  publish: boolean;
  reason:
    | "auto_publish"
    | "score_below_auto_merge"
    | "judge_low"
    | "judge_error"
    | "review_sample";
};

const JUDGE_SYSTEM_PROMPT = `You judge how citable an article is for AI search engines (ChatGPT, Perplexity, Google AI Overviews).
Score 0-100 on exactly two criteria, weighted equally:
1. DIRECT ANSWER FIRST: the opening paragraph directly and completely answers the title's implied question in 2-4 sentences, before any preamble.
2. SELF-CONTAINED SECTIONS: each H2 section can be lifted out alone and still make sense — it restates its subject, gives a complete answer in roughly 100-170 words, and does not depend on surrounding text.
Penalize: fluffy intros ("In today's fast-paced world"), sections that are only bullet fragments, marketing filler, sections that assume you read the previous one.
Return ONLY valid JSON: {"score": <0-100>, "reason": "<one short sentence>"}`;

// Pure — unit-testable. Tolerates prose around the JSON and clamps the score.
export function parseJudgeResponse(raw: string): { score: number; reason: string } {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON object in judge response");
  const parsed = JSON.parse(match[0]) as { score?: unknown; reason?: unknown };
  const score = Number(parsed.score);
  if (!Number.isFinite(score)) throw new Error("Judge response missing numeric score");
  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    reason: typeof parsed.reason === "string" ? parsed.reason.slice(0, 300) : "",
  };
}

// GEO-01 decomposed into the checks the prompt above actually asks for. Each
// is a yes/no Jev judgment; the 0-100 score is composed in code with the same
// equal weighting the prompt specified, plus the fluff penalty as a third term.
export const CITABILITY_QUESTIONS = {
  direct_answer_first: noul(
    "Does `article` open with a direct, self-contained answer about its subject (given by `title` when present) — a definition or the key claim, quotable on its own — in the first 2-4 sentences, before any preamble, hook, anecdote or throat-clearing?",
    { true: "The first paragraph could be lifted out alone as the answer to what the article is about", false: "The reader must get past setup, a hook, a story or context before reaching the substance" }
  ),
  sections_self_contained: noul(
    "Could each H2 section of `article` be lifted out alone and still make sense — restating its subject and giving a complete answer without depending on the surrounding text?",
    { true: "Sections restate their subject and stand alone", false: "Sections assume the previous one was read, or are only bullet fragments" }
  ),
  no_fluff: noul(
    "Is `article` free of fluffy intros (\"In today's fast-paced world\"), marketing filler, and sections that are only bullet fragments?",
    { true: "Every paragraph carries information", false: "Filler, hype or fragment-only sections are present" }
  ),
} as const;

const WEIGHTS: Record<keyof typeof CITABILITY_QUESTIONS, number> = { direct_answer_first: 0.4, sections_self_contained: 0.4, no_fluff: 0.2 };
const LABELS: Record<keyof typeof CITABILITY_QUESTIONS, string> = {
  direct_answer_first: "opening paragraph does not answer the question first",
  sections_self_contained: "H2 sections do not stand alone",
  no_fluff: "fluffy intro, filler or fragment-only sections",
};

/** Pure — unit-testable. Weighted mean of the checks → 0-100, reason = weakest check. */
export function composeCitabilityVerdict(answers: Answers<typeof CITABILITY_QUESTIONS>): { score: number; reason: string } {
  const keys = Object.keys(WEIGHTS) as Array<keyof typeof CITABILITY_QUESTIONS>;
  const score = Math.round(100 * keys.reduce((sum, k) => sum + WEIGHTS[k] * answers[k].noul, 0));
  const weakest = keys.reduce((a, b) => (answers[a].noul <= answers[b].noul ? a : b));
  return { score, reason: `${LABELS[weakest]} (p=${answers[weakest].noul.toFixed(2)})` };
}

async function judgeCitabilityJev(body: string, title?: string): Promise<{ score: number; reason: string }> {
  const answers = await systemOne({ ...(title ? { title } : {}), article: body.slice(0, 12_000) }, CITABILITY_QUESTIONS);
  return composeCitabilityVerdict(answers);
}

// Jev first (typed, deterministic), Groq as the fallback rung. Only when both
// fail does the verdict carry errored=true — which decidePublish treats as
// "hold for review", never as a pass.
export async function judgeCitability(body: string, title?: string): Promise<JudgeVerdict> {
  if (isTypeSafeConfigured()) {
    try {
      const { score, reason } = await judgeCitabilityJev(body, title);
      return { score, reason, errored: false };
    } catch (e) {
      console.error(`[publish-gate] jev judge failed, falling back to groq: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  return judgeCitabilityGroq(body);
}

async function judgeCitabilityGroq(body: string): Promise<JudgeVerdict> {
  try {
    const response = await groqCreate({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      max_tokens: 200,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: JUDGE_SYSTEM_PROMPT },
        // 12k chars ≈ 3k tokens — enough to judge opening + several H2 sections.
        { role: "user", content: body.slice(0, 12_000) },
      ],
    });
    const raw = response.choices[0]?.message?.content ?? "";
    const { score, reason } = parseJudgeResponse(raw);
    return { score, reason, errored: false };
  } catch (e) {
    return {
      score: 0,
      reason: e instanceof Error ? e.message.slice(0, 200) : String(e),
      errored: true,
    };
  }
}

// Pure — unit-testable. `publishedThisTick` is the count of auto-published
// articles earlier in the same tick, used for the deterministic review sample.
export function decidePublish(input: {
  citabilityScore: number;
  judge: JudgeVerdict;
  publishedThisTick: number;
  sampleEvery?: number;
}): PublishDecision {
  const sampleEvery =
    input.sampleEvery ??
    Math.max(1, Number(process.env.GEO_REVIEW_SAMPLE_EVERY ?? DEFAULT_REVIEW_SAMPLE_EVERY));

  if (!canAutoMerge(input.citabilityScore)) {
    return { publish: false, reason: "score_below_auto_merge" };
  }
  if (input.judge.errored) return { publish: false, reason: "judge_error" };
  if (input.judge.score < JUDGE_PASS_THRESHOLD) return { publish: false, reason: "judge_low" };
  // Hold every Nth otherwise-publishable article for human review.
  if ((input.publishedThisTick + 1) % sampleEvery === 0) {
    return { publish: false, reason: "review_sample" };
  }
  return { publish: true, reason: "auto_publish" };
}
