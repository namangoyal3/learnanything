/**
 * Prints exact core / AI lesson counts vs Lenny catalog (289).
 * Run from repo root: npm run catalog:count
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";

const envPath = resolve(process.cwd(), ".env");
if (existsSync(envPath)) {
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (process.env[k] === undefined) process.env[k] = v;
  }
}

const CORE = { aiGenerated: false } as const;
const CATALOG = 289;

async function main() {
  const prisma = new PrismaClient();
  try {
    const [core, locked, unlocked, aiGen] = await Promise.all([
      prisma.lesson.count({ where: CORE }),
      prisma.lesson.count({ where: { ...CORE, isLocked: true } }),
      prisma.lesson.count({ where: { ...CORE, isLocked: false } }),
      prisma.lesson.count({ where: { aiGenerated: true } }),
    ]);
    const notImported = Math.max(0, CATALOG - core);

    console.log("PM Streak — catalog vs database");
    console.log("--------------------------------");
    console.log(`Lenny catalog (reference):     ${CATALOG} episodes`);
    console.log(`Core lessons in DB:          ${core} (unlocked free: ${unlocked}, gated/locked rows: ${locked})`);
    console.log(`AI-generated (Explore) rows:   ${aiGen}`);
    console.log(`Catalog not in DB yet:       ${notImported} (max(0, ${CATALOG} − ${core}))`);
    console.log("");
    console.log(
      "After `npm run db:seed`: expect small core count (seed). After `npx tsx scripts/backfill-podcast-archive.ts`, core grows toward the catalog."
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
