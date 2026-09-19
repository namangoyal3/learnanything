// typesafe.ts — TypeSafe System One (Jev) client for the app.
//
// Jev returns typed judgments (probabilities), never text. Code keeps every
// rule and threshold; Jev answers narrow questions over a `state` object.
// Docs: https://docs.typesafe.ai/api · primitives: noul (yes/no probability),
// choice (one of a set + distribution), score (position on ordered levels,
// 0-indexed, may be fractional).
//
// Server-side only: reads TYPESAFE_API_KEY at call time. No SDK on purpose —
// the repo bans new deps when a few lines of fetch suffice. The SEO scripts
// keep their own stdlib copy (scripts/seo/jev.mjs) because plain-node .mjs
// files cannot import this module.

const ENDPOINT = "https://api.typesafe.ai/v1/systemone";
const MODEL = "jev-latest";
const RETRY_STATUSES = new Set([408, 429, 500, 502, 503, 504]);
const DEFAULT_TIMEOUT_MS = 20_000;

export type NoulQuestion = { type: "noul"; instructions: unknown; criteria?: { true?: string; false?: string } };
export type ChoiceQuestion = { type: "choice"; instructions: unknown; criteria: Record<string, string | null> };
export type ScoreQuestion = { type: "score"; instructions: unknown; criteria: unknown[] };
export type Question = NoulQuestion | ChoiceQuestion | ScoreQuestion;

export type NoulAnswer = { type: "noul"; noul: number };
export type ChoiceAnswer = { type: "choice"; choice: string; confidence: number; probabilities?: Record<string, number> };
export type ScoreAnswer = { type: "score"; score: number; confidence: number; probabilities?: Record<string, number> };

type AnswerFor<Q> = Q extends NoulQuestion ? NoulAnswer : Q extends ChoiceQuestion ? ChoiceAnswer : ScoreAnswer;
export type Answers<Q extends Record<string, Question>> = { [K in keyof Q]: AnswerFor<Q[K]> };

export const noul = (instructions: unknown, criteria?: NoulQuestion["criteria"]): NoulQuestion => ({
  type: "noul",
  instructions,
  ...(criteria ? { criteria } : {}),
});
export const choice = (instructions: unknown, criteria: ChoiceQuestion["criteria"]): ChoiceQuestion => ({
  type: "choice",
  instructions,
  criteria,
});
export const score = (instructions: unknown, criteria: unknown[]): ScoreQuestion => ({ type: "score", instructions, criteria });

export class TypeSafeError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = "TypeSafeError";
  }
}

export function isTypeSafeConfigured(): boolean {
  return Boolean(process.env.TYPESAFE_API_KEY);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Evaluate `questions` against `state`. Independent questions over the same
 * state go in one request — Jev runs them in parallel. Throws TypeSafeError
 * on auth/validation failures; retries transient statuses with backoff.
 */
export async function systemOne<Q extends Record<string, Question>>(
  state: unknown,
  questions: Q,
  opts: { retries?: number; timeoutMs?: number } = {}
): Promise<Answers<Q>> {
  const apiKey = process.env.TYPESAFE_API_KEY;
  if (!apiKey) throw new TypeSafeError("TYPESAFE_API_KEY not set");
  const retries = opts.retries ?? 2;
  const body = JSON.stringify({ state, model: MODEL, questions });

  for (let attempt = 0; ; attempt++) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), opts.timeoutMs ?? DEFAULT_TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body,
        signal: ctl.signal,
      });
    } catch (e) {
      clearTimeout(timer);
      if (attempt >= retries) throw new TypeSafeError(`network: ${e instanceof Error ? e.message : String(e)}`);
      await sleep(500 * 2 ** attempt);
      continue;
    }
    clearTimeout(timer);
    if (res.ok) {
      const data = (await res.json()) as { answers: Answers<Q> };
      return data.answers;
    }
    if (RETRY_STATUSES.has(res.status) && attempt < retries) {
      const retryAfter = Number(res.headers.get("retry-after")) || 0;
      await sleep(Math.max(retryAfter * 1000, 500 * 2 ** attempt));
      continue;
    }
    throw new TypeSafeError(`jev ${res.status}: ${(await res.text()).slice(0, 200)}`, res.status);
  }
}

/** Probability mass on `option` in a choice/score answer (0 when absent). */
export function probOf(answer: { probabilities?: Record<string, number>; confidence?: number; choice?: string }, option: string): number {
  return answer.probabilities?.[option] ?? (answer.choice === option ? (answer.confidence ?? 0) : 0);
}
