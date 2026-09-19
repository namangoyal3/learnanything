import Groq from "groq-sdk";
import { groqCreate } from "./groq";
import { choice, isTypeSafeConfigured, systemOne } from "./typesafe";

const VALID_SLUGS = [
  "product-strategy",
  "growth-metrics",
  "user-psychology",
  "leadership-execution",
  "pricing-monetization",
] as const;

export type CategorySlug = (typeof VALID_SLUGS)[number];

const SLUG_DESCRIPTIONS: Record<CategorySlug, string> = {
  "product-strategy": "Product vision, roadmap, prioritization, product-market fit, strategy frameworks",
  "growth-metrics": "Growth loops, activation, retention, DAU/MAU, A/B testing, experimentation, analytics, north star metrics",
  "user-psychology": "User behavior, motivation, habits, onboarding psychology, behavioral economics, UX research",
  "leadership-execution": "Managing teams, hiring, culture, shipping, execution, org design, stakeholder management, career",
  "pricing-monetization": "Pricing strategy, monetization, freemium, subscriptions, revenue, business models",
};

/**
 * Keyword-based fast classification — no LLM call, zero cost, ~0ms.
 * Falls back to null if no confident match, then the caller can use LLM.
 */
function classifyByKeywords(title: string, guest: string): CategorySlug | null {
  const text = `${title} ${guest}`.toLowerCase();

  if (/pric|monetiz|revenue|freemium|subscript|business model|charge|willingness to pay/i.test(text)) {
    return "pricing-monetization";
  }
  if (/growth|retention|activation|a\/b test|experiment|dau|mau|north star|metric|funnel|conversion|cohort|churn|engagement loop/i.test(text)) {
    return "growth-metrics";
  }
  if (/hire|hiring|culture|team|org design|management|executive|leadership|career|manager|vp of product|chief product/i.test(text)) {
    return "leadership-execution";
  }
  if (/user research|user psychology|behavior|habit|motivat|onboarding|ux|design|customer discovery|empathy/i.test(text)) {
    return "user-psychology";
  }
  if (/strateg|roadmap|prioriti|vision|product.market fit|pmf|framework|build vs buy|platform|positioning/i.test(text)) {
    return "product-strategy";
  }
  return null;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * LLM-based classification via Groq for episodes that don't match keywords.
 * Retries up to 3 times with backoff on rate-limit errors.
 */
async function classifyByLLM(
  groq: Groq,
  title: string,
  guest: string
): Promise<CategorySlug> {
  const descriptions = VALID_SLUGS.map(
    (slug) => `- ${slug}: ${SLUG_DESCRIPTIONS[slug]}`
  ).join("\n");

  const prompt = `You are classifying a podcast episode into exactly one category.

Episode title: "${title}"
Guest: "${guest}"

Categories:
${descriptions}

Reply with ONLY the slug of the best matching category. No explanation. One of: ${VALID_SLUGS.join(", ")}`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const completion = await groqCreate({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        max_tokens: 20,
        stream: false,
      });

      const raw = (completion.choices[0]?.message?.content ?? "").trim().toLowerCase();
      const match = VALID_SLUGS.find((slug) => raw.includes(slug));
      return match ?? "product-strategy";
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 429 && attempt < 3) {
        // Rate limited — wait 3s then retry
        await sleep(3000 * attempt);
        continue;
      }
      // On non-rate-limit errors or last attempt, fall back to default
      return "product-strategy";
    }
  }
  return "product-strategy";
}

/**
 * Jev Choice over the five slugs — the descriptions ARE the criteria, so the
 * answer is a typed slug with a distribution, never a string to substring-match.
 */
async function classifyByJev(title: string, guest: string): Promise<CategorySlug> {
  const answers = await systemOne(
    { episode: { title, guest } },
    { category: choice("Which category best fits `episode`, judged by what a PM would learn from it?", SLUG_DESCRIPTIONS) }
  );
  const slug = answers.category.choice as CategorySlug;
  return VALID_SLUGS.includes(slug) ? slug : "product-strategy";
}

/**
 * Classify a Lenny's Podcast episode into one of the 5 core category slugs.
 * Keyword match first (free); then Jev when configured; Groq as the last rung.
 */
export async function classifyEpisodeTopic(
  groq: Groq,
  title: string,
  guest: string
): Promise<CategorySlug> {
  const fast = classifyByKeywords(title, guest);
  if (fast) return fast;
  if (isTypeSafeConfigured()) {
    try {
      return await classifyByJev(title, guest);
    } catch (e) {
      console.error(`[archive-category] jev failed, falling back to groq: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  return classifyByLLM(groq, title, guest);
}
