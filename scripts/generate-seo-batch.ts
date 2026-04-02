import { prisma } from "../src/lib/prisma";
import { generateSeoArticle } from "../src/lib/llm-lessons";
import { searchLennyTranscripts } from "../src/lib/lesson-generator";
import { EXPLORE_SEED_TOPICS } from "../src/lib/explore-topics";
import { scoreSEO } from "../src/lib/seo-score";
import { groqCreate } from "../src/lib/groq";

function extractJSON(raw: string): string {
  const fenced = raw.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  let candidate = fenced ? fenced[1]!.trim() : raw.trim();
  const start = Math.min(
    candidate.indexOf("{") === -1 ? Infinity : candidate.indexOf("{"),
    candidate.indexOf("[") === -1 ? Infinity : candidate.indexOf("[")
  );
  if (start < Infinity) {
    const end = candidate.lastIndexOf("}") > candidate.lastIndexOf("]") 
      ? candidate.lastIndexOf("}") 
      : candidate.lastIndexOf("]");
    if (end !== -1) candidate = candidate.slice(start, end + 1);
  }
  return candidate;
}

async function runQualityEval(articleBody: string): Promise<{ score: number; feedback: string }> {
  try {
    const prompt = `Act as an expert PM Editor evaluating a new article for an elite PM audience.
Score the article from 1 to 10 based on these exact constraints:
1. 2026 Relevance: Does the article actively incorporate 2026-specific realities (e.g., modern AI agents, automated workflows)? If it reads like generic 2021 advice, penalize heavily.
2. PM Actionability: Are the tactics specific, tradeoff-oriented, and structured around constraints?
3. Narrative & Formatting: Is it easily readable with bolding, concise points, and clear sections?

ARTICLE TEXT:
${articleBody.substring(0, 4000)}...

Return valid JSON only.
{
  "score": 8,
  "feedback": "..."
}
`;
    const res = await groqCreate({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.2
    });

    const raw = res.choices[0]?.message?.content;
    const parsed = raw ? JSON.parse(extractJSON(raw)) : null;
    return parsed?.score !== undefined 
      ? { score: Number(parsed.score), feedback: String(parsed.feedback) }
      : { score: 0, feedback: "Failed to parse eval" };
  } catch (error) {
    console.error("Eval failed:", error);
    return { score: 0, feedback: "Eval error" };
  }
}

async function run() {
  const targetTopics = EXPLORE_SEED_TOPICS.slice(0, 10);
  console.log(`Starting generation for ${targetTopics.length} topics...`);

  let successCount = 0;
  let failCount = 0;

  for (const topic of targetTopics) {
    console.log(`\n\n--- Processing Topic: ${topic} ---`);
    try {
      const searchResults = await searchLennyTranscripts(topic);
      if (!searchResults || searchResults.length < 2) {
        console.warn(`[SKIP] Not enough MCP search context for: ${topic}`);
        failCount++;
        continue;
      }
      
      console.log(`[1/3] Context found. Generating article...`);
      const articleData = await generateSeoArticle(topic, searchResults);
      
      console.log(`[2/3] Evaluating article quality and 2026 relevance...`);
      const evalResult = await runQualityEval(articleData.body);
      
      const seoScore = scoreSEO({
        title: articleData.title,
        description: articleData.description,
        body: articleData.body,
        primaryKeyword: articleData.primaryKeyword,
      });

      console.log(`* SEO Score: ${seoScore}/100`);
      console.log(`* LLM Quality Eval: ${evalResult.score}/10`);
      console.log(`* LLM Feedback: ${evalResult.feedback}`);

      if (seoScore < 70) {
        console.warn(`[SKIP] Failed SEO checks (Score: ${seoScore})`);
        failCount++;
        continue;
      }

      if (evalResult.score < 7) {
        console.warn(`[SKIP] Failed LLM Quality checks (Score: ${evalResult.score})`);
        failCount++;
        continue;
      }

      console.log(`[3/3] Checks passed. Saving to DB...`);
      const slug = articleData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 80) + `-${Math.random().toString(36).substring(2, 6)}`;

      await prisma.article.create({
        data: {
          slug,
          title: articleData.title,
          description: articleData.description,
          body: articleData.body,
          vertical: "pm",
          tags: [topic, "lenny-podcast-insights"],
          seoScore,
          published: true,
          publishedAt: new Date(),
          wordCount: articleData.body.split(/\s+/).length,
          sourceUrls: [],
        },
      });
      
      console.log(`[SUCCESS] Published: ${articleData.title} -> /learn/pm/${slug}`);
      successCount++;

    } catch (err: any) {
      console.error(`[ERROR] Processing ${topic} failed:`, err.message);
      failCount++;
    }
  }

  console.log(`\n\n--- BATCH COMPLETE ---`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed/Skipped: ${failCount}`);
  process.exit(0);
}

run();
