import { groqCreate } from "@/lib/groq";
import { LESSON_TYPES, type JDParseResult } from "@/lib/pm-foundations";
import { choice, isTypeSafeConfigured, noul, score, systemOne, type Answers } from "@/lib/typesafe";

const JD_PARSE_SYSTEM = `You are an expert PM interview prep analyst.
Given a job description, return ONLY valid JSON with this exact shape:
{
  "skills": ["product_sense", "data", "execution", "communication"],
  "level": "APM|PM|Senior PM|Director",
  "domain": "consumer|b2b|platform|fintech|ai|other",
  "must_have": ["..."],
  "nice_to_have": ["..."],
  "estimated_interview_focus": {
    "product_sense": number,
    "metrics": number,
    "execution": number,
    "strategy": number,
    "behavioral": number
  }
}

Rules:
- Use only lowercase snake_case keys.
- estimated_interview_focus values must be decimals between 0 and 1 and sum to 1.
- If unknown, infer best-effort from JD language.
- Return JSON only, no markdown.`;

const DEFAULT_FOCUS: JDParseResult["estimatedInterviewFocus"] = {
  product_sense: 0.24,
  metrics: 0.22,
  execution: 0.22,
  strategy: 0.16,
  behavioral: 0.16,
};

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

function normalizeFocus(
  input: Partial<Record<(typeof LESSON_TYPES)[number], number>> | null | undefined
): JDParseResult["estimatedInterviewFocus"] {
  const raw: JDParseResult["estimatedInterviewFocus"] = { ...DEFAULT_FOCUS };
  for (const key of LESSON_TYPES) {
    const value = Number(input?.[key]);
    if (Number.isFinite(value) && value > 0) {
      raw[key] = clamp01(value);
    }
  }
  const sum = Object.values(raw).reduce((acc, value) => acc + value, 0);
  if (sum <= 0) return { ...DEFAULT_FOCUS };
  return {
    product_sense: raw.product_sense / sum,
    metrics: raw.metrics / sum,
    execution: raw.execution / sum,
    strategy: raw.strategy / sum,
    behavioral: raw.behavioral / sum,
  };
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean)
    .slice(0, 20);
}

function safeParseJson(raw: string): unknown {
  const match = raw.match(/\{[\s\S]*\}/);
  return JSON.parse(match?.[0] ?? raw);
}

function heuristicParse(rawJdText: string): JDParseResult {
  const text = rawJdText.toLowerCase();
  const skills = new Set<string>();

  if (/(metric|analytics|sql|ab test|experiment)/.test(text)) skills.add("data");
  if (/(roadmap|execution|delivery|prioriti)/.test(text)) skills.add("execution");
  if (/(user|customer|research|persona)/.test(text)) skills.add("product_sense");
  if (/(stakeholder|communicat|cross-functional|collaborat)/.test(text)) {
    skills.add("communication");
  }
  if (/(ai|machine learning|llm|genai)/.test(text)) skills.add("ai_pm");
  if (skills.size === 0) {
    skills.add("product_sense");
    skills.add("execution");
  }

  let level = "PM";
  if (/(apm|associate product manager)/.test(text)) level = "APM";
  if (/(senior product manager|sr\.?\s*pm)/.test(text)) level = "Senior PM";
  if (/(director|group product manager|head of product|vp product)/.test(text)) {
    level = "Director";
  }

  let domain = "other";
  if (/(b2b|enterprise|saas)/.test(text)) domain = "b2b";
  else if (/(consumer|b2c|mobile app|growth)/.test(text)) domain = "consumer";
  else if (/(platform|api|infra|developer)/.test(text)) domain = "platform";
  else if (/(fintech|payments|bank|risk)/.test(text)) domain = "fintech";
  else if (/(ai|machine learning|llm|genai)/.test(text)) domain = "ai";

  return {
    skills: Array.from(skills),
    level,
    domain,
    mustHave: [],
    niceToHave: [],
    estimatedInterviewFocus: normalizeFocus(null),
  };
}

// ── Jev path ───────────────────────────────────────────────────────────────
// Closed-set fields are judgments, not extractions: level and domain are a
// Choice, each skill is a Noul, and interview focus is a Score per lesson type
// (normalised in code). Only the free-text requirement lists still need an
// extractor; Jev then verifies every item is grounded in the JD and decides
// must-have vs nice-to-have — the SDE-cascade shape from the TypeSafe docs.
const EMPHASIS = [
  "Not mentioned",
  "Mentioned in passing",
  "One of several responsibilities",
  "A core, repeatedly stressed responsibility",
];
export const JD_QUESTIONS = {
  level: choice("What seniority level does `jd` describe?", {
    APM: "Associate / entry-level product manager, rotational or graduate program",
    PM: "Product manager or product owner owning a feature area, mid-level",
    "Senior PM": "Senior / lead product manager owning a product line or several squads",
    Director: "Director, group PM, head of product, VP — manages PMs or an org",
  }),
  domain: choice("Which product domain does `jd` describe?", {
    consumer: "Consumer / B2C apps, growth, marketplaces for end users",
    b2b: "B2B, enterprise or SaaS sold to businesses",
    platform: "Platform, APIs, infrastructure, developer tools",
    fintech: "Payments, lending, banking, insurance, wealth, risk",
    ai: "AI/ML/LLM products or model-driven features",
    other: "None of the above fits",
  }),
  skill_product_sense: noul("Does `jd` require product sense — understanding users, framing problems, product judgment?"),
  skill_data: noul("Does `jd` require data skills — metrics, analytics, SQL, or experimentation?"),
  skill_execution: noul("Does `jd` require execution skills — roadmaps, delivery, prioritisation, shipping with engineering?"),
  skill_communication: noul("Does `jd` require communication or stakeholder / cross-functional skills?"),
  skill_ai_pm: noul("Does `jd` involve AI, ML or LLM products, or AI-specific product work?"),
  focus_product_sense: score("How heavily does `jd` emphasise product sense (users, problems, product judgment)?", EMPHASIS),
  focus_metrics: score("How heavily does `jd` emphasise metrics, analytics and experimentation?", EMPHASIS),
  focus_execution: score("How heavily does `jd` emphasise execution — roadmaps, delivery, working with engineering?", EMPHASIS),
  focus_strategy: score("How heavily does `jd` emphasise strategy — vision, market, positioning, long-term bets?", EMPHASIS),
  focus_behavioral: score("How heavily does `jd` emphasise leadership, collaboration, influence and culture?", EMPHASIS),
} as const;

const SKILL_KEYS: Array<[keyof typeof JD_QUESTIONS, string]> = [
  ["skill_product_sense", "product_sense"],
  ["skill_data", "data"],
  ["skill_execution", "execution"],
  ["skill_communication", "communication"],
  ["skill_ai_pm", "ai_pm"],
];
const SKILL_AT = 0.5;
const emphasis = (position: number): number => (Math.max(0, Math.min(EMPHASIS.length - 1, position)) + 0.25) / (EMPHASIS.length - 1 + 0.25);

/** Pure — Jev answers + (already verified) requirement lists → JDParseResult. */
export function composeJdFromJev(
  answers: Answers<typeof JD_QUESTIONS>,
  lists: { mustHave: string[]; niceToHave: string[] }
): JDParseResult {
  const skills = SKILL_KEYS.filter(([q]) => (answers[q] as { noul: number }).noul >= SKILL_AT).map(([, key]) => key);
  if (skills.length === 0) skills.push("product_sense", "execution");
  return {
    skills,
    level: answers.level.choice,
    domain: answers.domain.choice,
    mustHave: lists.mustHave,
    niceToHave: lists.niceToHave,
    // Scores are 0..3 positions; map to (0,1] before normalizeFocus, which
    // clamps each value to [0,1]. +0.25 keeps "not mentioned" at a small share.
    estimatedInterviewFocus: normalizeFocus({
      product_sense: emphasis(answers.focus_product_sense.score),
      metrics: emphasis(answers.focus_metrics.score),
      execution: emphasis(answers.focus_execution.score),
      strategy: emphasis(answers.focus_strategy.score),
      behavioral: emphasis(answers.focus_behavioral.score),
    }),
  };
}

const REQUIREMENT_AT = 0.5;
const MUST_AT = 0.5;
const MAX_CLAUSES = 30;
const MAX_PER_LIST = 8;

/**
 * Requirement candidates are verbatim clauses of the JD (bullets, sentences,
 * comma-separated items), 2–24 words. Code proposes, Jev selects — label
 * fragments like "Must have" are offered too and rejected by the judgment.
 */
export function jdClauses(jd: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of jd.split(/\n|[•·▪]|(?<=[.;:!?])\s+|,\s+(?=[A-Za-z0-9])/)) {
    const c = raw.replace(/^[\s\-–—*]+|[\s.;:]+$/g, "").replace(/\s+/g, " ");
    const words = c.split(" ").length;
    if (words < 2 || words > 24 || seen.has(c.toLowerCase())) continue;
    seen.add(c.toLowerCase());
    out.push(c);
    if (out.length >= MAX_CLAUSES) break;
  }
  return out;
}

/** Jev picks which clauses are qualifications, and which of those are hard requirements. */
async function selectRequirements(jd: string, clauses: string[]): Promise<{ mustHave: string[]; niceToHave: string[] }> {
  if (!clauses.length) return { mustHave: [], niceToHave: [] };
  const questions: Record<string, ReturnType<typeof noul>> = {};
  clauses.forEach((_, i) => {
    questions[`req_${i}`] = noul(
      `Is \`clauses[${i}]\` a candidate qualification or requirement in \`jd\` — a skill, experience, credential or background the applicant must bring — rather than a description of the role, team, company, or benefits?`
    );
    questions[`must_${i}`] = noul(`Does \`jd\` present \`clauses[${i}]\` as a hard requirement rather than a preference, bonus, or nice-to-have?`);
  });
  const answers = await systemOne({ jd, clauses }, questions);
  const mustHave: string[] = [];
  const niceToHave: string[] = [];
  clauses.forEach((c, i) => {
    if (answers[`req_${i}`].noul < REQUIREMENT_AT) return;
    const bucket = answers[`must_${i}`].noul >= MUST_AT ? mustHave : niceToHave;
    if (bucket.length < MAX_PER_LIST) bucket.push(c);
  });
  return { mustHave, niceToHave };
}

async function parseJdWithJev(jd: string): Promise<JDParseResult> {
  // Two requests: the closed-set judgments over the JD, and the clause
  // selection — independent, so they run concurrently.
  const [answers, lists] = await Promise.all([systemOne({ jd }, JD_QUESTIONS), selectRequirements(jd, jdClauses(jd))]);
  return composeJdFromJev(answers, lists);
}

export async function parseJdText(rawJdText: string): Promise<JDParseResult> {
  const trimmed = rawJdText.trim().slice(0, 24000);
  if (!trimmed) {
    throw new Error("JD text is empty");
  }
  if (isTypeSafeConfigured()) {
    try {
      return await parseJdWithJev(trimmed);
    } catch (e) {
      console.error(`[jd-parser] jev failed, falling back to groq: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  try {
    return await parseJdWithGroq(trimmed);
  } catch {
    return heuristicParse(trimmed);
  }
}

async function parseJdWithGroq(trimmed: string): Promise<JDParseResult> {
  {
    const result = await groqCreate({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: JD_PARSE_SYSTEM },
        { role: "user", content: trimmed },
      ],
      temperature: 0.2,
      max_tokens: 1200,
      response_format: { type: "json_object" },
    });

    const raw = result.choices[0]?.message?.content ?? "";
    const parsed = safeParseJson(raw) as Record<string, unknown>;

    return {
      skills: toStringArray(parsed.skills),
      level: typeof parsed.level === "string" ? parsed.level : "PM",
      domain: typeof parsed.domain === "string" ? parsed.domain : "other",
      mustHave: toStringArray(parsed.must_have),
      niceToHave: toStringArray(parsed.nice_to_have),
      estimatedInterviewFocus: normalizeFocus(
        parsed.estimated_interview_focus as Partial<Record<(typeof LESSON_TYPES)[number], number>>
      ),
    };
  }
}

export const parseJobDescription = parseJdText;
