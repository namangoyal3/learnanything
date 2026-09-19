import { describe, it, expect } from "vitest";
import { composeJudgeResult, JUDGE_QUESTIONS, type JudgeAnswers } from "../ai-judge-jev";
import { CRITICAL_FEEDBACK_MAX, CRITICAL_FEEDBACK_MIN } from "../pm-foundations";

const s = (position: number) => ({ type: "score" as const, score: position, confidence: 0.8 });
const n = (p: number) => ({ type: "noul" as const, noul: p });

const strong: JudgeAnswers = {
  user_focus: s(3.6),
  structure: s(3.2),
  data_thinking: s(2.8),
  tradeoffs: s(3.1),
  addresses_prompt: n(0.95),
  is_generic: n(0.05),
  names_metric: n(0.9),
  quantifies: n(0.8),
  states_tradeoff: n(0.85),
  prioritizes: n(0.7),
  names_risk: n(0.6),
  states_problem_first: n(0.9),
};

describe("composeJudgeResult", () => {
  it("maps 0-indexed score positions to 1–5 and derives deltas from scores", () => {
    const r = composeJudgeResult(strong);
    expect(r.scores).toEqual({ user_focus: 5, structure: 4, data_thinking: 4, tradeoffs: 4 });
    expect(r.skill_deltas).toContainEqual({ skill: "product_sense", delta: 6 });
    expect(r.skill_deltas).toContainEqual({ skill: "communication", delta: 3 });
  });

  it("clamps positions outside the level range", () => {
    const r = composeJudgeResult({ ...strong, user_focus: s(-0.4), tradeoffs: s(9) });
    expect(r.scores.user_focus).toBe(1);
    expect(r.scores.tradeoffs).toBe(5);
  });

  it("selects coaching lines from the bank, most severe first, capped at the max", () => {
    const weak: JudgeAnswers = {
      ...strong,
      is_generic: n(0.9),
      names_metric: n(0.1),
      states_tradeoff: n(0.2),
      quantifies: n(0.1),
      names_risk: n(0.2),
    };
    const r = composeJudgeResult(weak);
    expect(r.feedback_comments).toHaveLength(CRITICAL_FEEDBACK_MAX);
    expect(r.feedback_comments[0]).toMatch(/pasted into almost any PM prompt/);
    expect(r.feedback_comments[1]).toMatch(/success metric/);
    expect(r.feedback_summary).toBe(r.feedback_comments[0]);
  });

  it("fills up to the minimum with the weakest-dimension stretch line when nothing fires", () => {
    const r = composeJudgeResult({ ...strong, data_thinking: s(1.2) });
    expect(r.feedback_comments.length).toBeGreaterThanOrEqual(CRITICAL_FEEDBACK_MIN);
    expect(r.feedback_comments[0]).toMatch(/^Weakest dimension: data thinking/);
  });

  it("asks every dimension as a 5-level score and every check as a noul", () => {
    for (const d of ["user_focus", "structure", "data_thinking", "tradeoffs"] as const) {
      expect(JUDGE_QUESTIONS[d].type).toBe("score");
      expect(JUDGE_QUESTIONS[d].criteria).toHaveLength(5);
    }
    expect(JUDGE_QUESTIONS.is_generic.type).toBe("noul");
  });
});
