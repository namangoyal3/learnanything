import { describe, it, expect } from "vitest";
import { composeJdFromJev, jdClauses, JD_QUESTIONS } from "../jd-parser";

const n = (p: number) => ({ type: "noul" as const, noul: p });
const s = (position: number) => ({ type: "score" as const, score: position, confidence: 0.8 });
const c = (choice: string) => ({ type: "choice" as const, choice, confidence: 0.9 });

describe("jdClauses", () => {
  it("splits bullets, sentences and comma lists into verbatim 2–24-word clauses", () => {
    const jd = "Must have: 5+ years in product management, strong SQL skills.\n- Nice to have: marketplace experience\nWe are a fun team!";
    const clauses = jdClauses(jd);
    expect(clauses).toContain("5+ years in product management");
    expect(clauses).toContain("strong SQL skills");
    expect(clauses).toContain("marketplace experience");
    expect(clauses).not.toContain("team!"); // too short
    for (const cl of clauses) expect(jd).toContain(cl); // never generated
  });
});

describe("composeJdFromJev", () => {
  const answers = {
    level: c("Senior PM"),
    domain: c("fintech"),
    skill_product_sense: n(0.9),
    skill_data: n(0.8),
    skill_execution: n(0.7),
    skill_communication: n(0.3),
    skill_ai_pm: n(0.1),
    focus_product_sense: s(2),
    focus_metrics: s(3),
    focus_execution: s(3),
    focus_strategy: s(0),
    focus_behavioral: s(1),
  };
  it("keeps skills at or above the floor and copies verified lists through", () => {
    const r = composeJdFromJev(answers, { mustHave: ["5+ years in product management"], niceToHave: [] });
    expect(r.skills).toEqual(["product_sense", "data", "execution"]);
    expect(r.level).toBe("Senior PM");
    expect(r.domain).toBe("fintech");
    expect(r.mustHave).toEqual(["5+ years in product management"]);
  });
  it("turns emphasis positions into a focus distribution that sums to 1 and orders correctly", () => {
    const f = composeJdFromJev(answers, { mustHave: [], niceToHave: [] }).estimatedInterviewFocus;
    const sum = Object.values(f).reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(1, 6);
    expect(f.metrics).toBeGreaterThan(f.product_sense);
    expect(f.product_sense).toBeGreaterThan(f.strategy);
    expect(f.strategy).toBeGreaterThan(0); // "not mentioned" keeps a small share
  });
  it("falls back to a default skill pair when nothing clears the floor", () => {
    const none = { ...answers, skill_product_sense: n(0.1), skill_data: n(0.1), skill_execution: n(0.1) };
    expect(composeJdFromJev(none, { mustHave: [], niceToHave: [] }).skills).toEqual(["product_sense", "execution"]);
  });
  it("asks level and domain as choices and every skill as a noul", () => {
    expect(JD_QUESTIONS.level.type).toBe("choice");
    expect(Object.keys(JD_QUESTIONS.level.criteria)).toEqual(["APM", "PM", "Senior PM", "Director"]);
    expect(JD_QUESTIONS.skill_data.type).toBe("noul");
  });
});
