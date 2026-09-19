/**
 * scripts/judge-shadow.ts — replay stored lesson attempts through the Jev
 * judge and compare against the scores the Groq judge gave at the time.
 *
 * Read-only. Prints per-dimension agreement (exact, ±1) and mean absolute
 * difference, plus the attempts where the two disagree by ≥2 so a human can
 * decide which judge was right. Run this before flipping JUDGE_PROVIDER.
 *
 * Usage: npx tsx scripts/judge-shadow.ts [--limit 200]
 * Requires: DATABASE_URL, TYPESAFE_API_KEY
 */
import { PrismaClient } from "@prisma/client";
import { judgePmAnswerJev } from "../src/lib/ai-judge-jev";
import { PM_DIMENSIONS, type PmDimension } from "../src/lib/pm-foundations";

const prisma = new PrismaClient();
const limit = Number(process.argv[process.argv.indexOf("--limit") + 1]) || 200;

const STORED: Record<PmDimension, "scoreUserFocus" | "scoreStructure" | "scoreData" | "scoreTradeoffs"> = {
  user_focus: "scoreUserFocus",
  structure: "scoreStructure",
  data_thinking: "scoreData",
  tradeoffs: "scoreTradeoffs",
};

async function main() {
  const attempts = await prisma.lessonAttempt.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    select: { id: true, userAnswer: true, scoreUserFocus: true, scoreStructure: true, scoreData: true, scoreTradeoffs: true, lesson: { select: { promptText: true } } },
  });
  const rows = attempts.filter((a) => a.lesson?.promptText && a.userAnswer.trim().length > 20);
  console.log(`replaying ${rows.length} attempts`);

  const diffs: Record<PmDimension, number[]> = { user_focus: [], structure: [], data_thinking: [], tradeoffs: [] };
  const disagreements: string[] = [];
  for (const a of rows) {
    const jev = await judgePmAnswerJev({ lessonPrompt: a.lesson!.promptText!, userAnswer: a.userAnswer });
    for (const d of PM_DIMENSIONS) {
      const delta = jev.scores[d] - a[STORED[d]];
      diffs[d].push(delta);
      if (Math.abs(delta) >= 2) disagreements.push(`${a.id} ${d}: groq=${a[STORED[d]]} jev=${jev.scores[d]} :: ${a.userAnswer.slice(0, 90).replace(/\s+/g, " ")}`);
    }
  }

  console.log("\ndimension        exact   ±1     mean|Δ|   mean(jev−groq)");
  for (const d of PM_DIMENSIONS) {
    const v = diffs[d];
    const n = v.length || 1;
    const exact = v.filter((x) => x === 0).length / n;
    const within = v.filter((x) => Math.abs(x) <= 1).length / n;
    const mad = v.reduce((s, x) => s + Math.abs(x), 0) / n;
    const bias = v.reduce((s, x) => s + x, 0) / n;
    console.log(`${d.padEnd(16)} ${(exact * 100).toFixed(0).padStart(4)}%  ${(within * 100).toFixed(0).padStart(4)}%   ${mad.toFixed(2).padStart(6)}   ${bias >= 0 ? "+" : ""}${bias.toFixed(2)}`);
  }
  console.log(`\n${disagreements.length} dimension-level disagreements of ≥2 points:`);
  for (const line of disagreements.slice(0, 40)) console.log("  " + line);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
