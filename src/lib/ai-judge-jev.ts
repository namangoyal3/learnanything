// ai-judge-jev.ts — PM-answer judge on TypeSafe Jev (System One).
//
// The judge users spend credits on. Instead of one generative call that
// returns scores + prose in a JSON blob, four Score questions (one per PM
// dimension, levels written as concrete situations) and a set of Noul checks
// run in ONE request. Everything downstream is code:
//   - 1–5 scores  = rounded Score position + 1
//   - feedback    = coaching lines SELECTED from a fixed bank by which Nouls
//                   fired (critical tone is guaranteed by the bank, not asked for)
//   - skill deltas = a function of the scores (the model never invents them)
// Same JudgeResult shape as the Groq judge, so /api/lesson-attempts is untouched.

import { CRITICAL_FEEDBACK_MAX, CRITICAL_FEEDBACK_MIN, PM_DIMENSIONS, type PmDimension } from "@/lib/pm-foundations";
import { noul, score, systemOne, type Answers } from "@/lib/typesafe";
import type { JudgeResult } from "@/lib/ai-judge";

// Levels are 0-indexed positions; 1–5 score = round(position) + 1.
export const JUDGE_QUESTIONS = {
  user_focus: score("How well does `answer` center a specific user and their problem, for the situation in `prompt`?", [
    "No user is mentioned; the answer jumps straight to features or solutions",
    "Mentions 'users' or 'customers' generically, with no segment and no stated problem",
    "Names a user segment, but their problem is vague or assumed rather than stated",
    "Names a segment and a concrete problem, with some evidence or a worked example",
    "Names a segment, a concrete problem, evidence for it, and ties every proposal back to that problem",
  ]),
  structure: score("How clearly structured is `answer` for a listener in a spoken interview?", [
    "A single unbroken stream of ideas with no visible order",
    "Some ordering, but ideas repeat or jump around",
    "Clear sections or steps, but uneven: parts are missing or padded",
    "Clear sections in a logical order that a listener could follow and summarise",
    "A framework or steps announced up front, followed consistently, closed with a crisp conclusion",
  ]),
  data_thinking: score("How well does `answer` use data and metrics to reason?", [
    "No metrics, numbers, or measurement are mentioned",
    "Says success would be measured but names no metric",
    "Names a metric, but not how it would be measured or what target matters",
    "Names specific metrics with a rationale and how they would be read",
    "Specific leading and lagging metrics, a target or baseline, and the decision the data would drive",
  ]),
  tradeoffs: score("How well does `answer` handle trade-offs between options?", [
    "Presents one option as obviously right; nothing is given up",
    "Lists options but never chooses or compares them",
    "Chooses an option and mentions a cost, but the comparison is thin",
    "Compares options on stated criteria and explains what the chosen option gives up",
    "Compares on criteria, chooses, states what is given up, and names when the choice would flip",
  ]),
  addresses_prompt: noul("Does `answer` engage with the specific situation and constraints stated in `prompt`, rather than a generic version of the task?"),
  is_generic: noul("Could `answer` be submitted unchanged for a different PM prompt?", {
    true: "Nothing in the answer is specific to this prompt's product, users, or constraints",
    false: "The answer references details that only make sense for this prompt",
  }),
  names_metric: noul("Does `answer` name at least one specific success metric it would track?"),
  quantifies: noul("Does `answer` quantify anything — a size, rate, target, timeline, or baseline?"),
  states_tradeoff: noul("Does `answer` state a trade-off: an option it chose and what it gave up by choosing it?"),
  prioritizes: noul("Does `answer` explicitly prioritize among its ideas instead of listing everything as equally important?"),
  names_risk: noul("Does `answer` name a risk or failure mode of its own proposal and how it would be detected?"),
  states_problem_first: noul("Does `answer` state the user problem before proposing any solution?"),
} as const;

export type JudgeAnswers = Answers<typeof JUDGE_QUESTIONS>;

// Coaching bank — each line fires when its Noul crosses the threshold in the
// stated direction. `severity` orders the lines when more fire than fit.
const FIRE_AT = 0.6;
type BankLine = { key: keyof JudgeAnswers; whenAbove: boolean; severity: number; text: string };
const COACHING_BANK: BankLine[] = [
  { key: "is_generic", whenAbove: true, severity: 10, text: "Your answer could be pasted into almost any PM prompt — anchor it in this product, these users, and the constraints given." },
  { key: "addresses_prompt", whenAbove: false, severity: 9, text: "You answered a generic version of the task and skipped the specific constraints in the prompt — name them and show how they change your plan." },
  { key: "states_problem_first", whenAbove: false, severity: 8, text: "You proposed solutions before stating the user problem — say who is stuck, on what, and why it matters before any feature." },
  { key: "names_metric", whenAbove: false, severity: 7, text: "You never named a success metric — say exactly what you would measure and what number would tell you it worked." },
  { key: "states_tradeoff", whenAbove: false, severity: 6, text: "No trade-off was made explicit — state what you chose, what you gave up, and why that cost is acceptable." },
  { key: "prioritizes", whenAbove: false, severity: 5, text: "Everything was listed as equally important — pick the one thing you would do first and defend the order." },
  { key: "quantifies", whenAbove: false, severity: 4, text: "Nothing was quantified — put rough numbers on the user base, the impact, or the timeline so the reasoning can be checked." },
  { key: "names_risk", whenAbove: false, severity: 3, text: "You did not name a way your own plan could fail — state the biggest risk and the signal that would reveal it early." },
];

// Fallback lines keyed on the weakest Score dimension, used only when fewer
// Nouls fire than CRITICAL_FEEDBACK_MIN requires. Phrased as a weakness at
// ≤3 and as the next push at 4–5, so a strong answer is not told it failed.
const DIMENSION_STRETCH: Record<PmDimension, { label: string; text: string }> = {
  user_focus: { label: "user focus", text: "tie every proposal back to one named user segment and their concrete problem." },
  structure: { label: "structure", text: "announce your framework up front, then follow it step by step to a clear conclusion." },
  data_thinking: { label: "data thinking", text: "pair each decision with the metric that would confirm or reverse it." },
  tradeoffs: { label: "trade-offs", text: "compare options on explicit criteria and say what the chosen one gives up." },
};
const stretchLine = (d: PmDimension, five: number): string =>
  five <= 3
    ? `Weakest dimension: ${DIMENSION_STRETCH[d].label} — ${DIMENSION_STRETCH[d].text}`
    : `To push further on ${DIMENSION_STRETCH[d].label}: ${DIMENSION_STRETCH[d].text}`;

const DIMENSION_TO_SKILL: Record<PmDimension, string> = {
  user_focus: "product_sense",
  structure: "communication",
  data_thinking: "data_thinking",
  tradeoffs: "tradeoffs",
};

const toFive = (position: number): number => Math.max(1, Math.min(5, Math.round(position) + 1));

/** Pure: Jev answers → JudgeResult. Unit-tested; no network. */
export function composeJudgeResult(answers: JudgeAnswers): JudgeResult {
  const scores = Object.fromEntries(PM_DIMENSIONS.map((d) => [d, toFive(answers[d].score)])) as Record<PmDimension, number>;

  const fired = COACHING_BANK.filter((line) => {
    const p = (answers[line.key] as { noul: number }).noul;
    return line.whenAbove ? p >= FIRE_AT : p <= 1 - FIRE_AT;
  })
    .sort((a, b) => b.severity - a.severity)
    .map((l) => l.text);

  const weakestFirst = [...PM_DIMENSIONS].sort((a, b) => scores[a] - scores[b] || answers[a].score - answers[b].score);
  const feedback_comments = [...fired];
  for (const d of weakestFirst) {
    if (feedback_comments.length >= CRITICAL_FEEDBACK_MIN) break;
    feedback_comments.push(stretchLine(d, scores[d]));
  }

  // Deltas are a function of the score: 3 is neutral, each step is worth 3.
  const skill_deltas = PM_DIMENSIONS.map((d) => ({ skill: DIMENSION_TO_SKILL[d], delta: (scores[d] - 3) * 3 }));

  return {
    scores,
    feedback_comments: feedback_comments.slice(0, CRITICAL_FEEDBACK_MAX),
    skill_deltas,
    feedback_summary: feedback_comments[0] ?? stretchLine(weakestFirst[0], scores[weakestFirst[0]]),
  };
}

export async function judgePmAnswerJev(params: { lessonPrompt: string; userAnswer: string; referenceAnswers?: string[] }): Promise<JudgeResult> {
  const state = {
    prompt: params.lessonPrompt,
    answer: params.userAnswer,
    ...(params.referenceAnswers?.length ? { reference_strong_answers: params.referenceAnswers } : {}),
  };
  const answers = await systemOne(state, JUDGE_QUESTIONS);
  return composeJudgeResult(answers);
}
