import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// Load .env files in priority order (first match wins per key)
for (const p of [".env.local", ".env", ".env.production"].map((f) => resolve(process.cwd(), f))) {
  if (!existsSync(p)) continue;
  const text = readFileSync(p, "utf8");
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    // Strip literal \n that appear in .env.local values
    v = v.replace(/\\n/g, "");
    if (process.env[k] === undefined) process.env[k] = v;
  }
}

import { prisma } from "../src/lib/prisma";
import { generateSeoArticle } from "../src/lib/llm-lessons";
import { searchLennyTranscripts } from "../src/lib/lesson-generator";
import { scoreArticle } from "../src/lib/seo-score";

const BATCH_SIZE = 25;

async function run() {
  console.log("=== PM Streak SEO Article Generator (D4) ===\n");

  // Pick top pending keywords by priority
  const keywords = await prisma.seoKeyword.findMany({
    where: { status: "pending", vertical: "pm" },
    orderBy: { priority: "desc" },
    take: BATCH_SIZE,
  });

  console.log(`Found ${keywords.length} pending keywords to process.\n`);

  const published: string[] = [];
  let skipped = 0;

  for (const kw of keywords) {
    console.log(`\n--- [${keywords.indexOf(kw) + 1}/${keywords.length}] ${kw.keyword} ---`);

    // Mark as in-progress
    await prisma.seoKeyword.update({
      where: { id: kw.id },
      data: { status: "mapping" },
    });

    try {
      // Step 1: Search Lenny transcripts for context
      const results = await searchLennyTranscripts(kw.keyword);
      if (!results || results.length < 2) {
        console.warn(`[SKIP] Not enough transcript context (got ${results?.length ?? 0})`);
        await prisma.seoKeyword.update({ where: { id: kw.id }, data: { status: "failed" } });
        skipped++;
        continue;
      }
      console.log(`[1/3] Found ${results.length} transcript excerpts.`);

      // Step 2: Generate SEO article
      const article = await generateSeoArticle(kw.keyword, results);
      console.log(`[2/3] Generated: "${article.title}"`);

      // Step 3: Score article
      const scored = scoreArticle({
        title: article.title,
        description: article.description,
        body: article.body,
        primaryKeyword: article.primaryKeyword,
      });
      console.log(`      SEO score: ${scored.seoScore} | GEO score: ${scored.geoScore} | Overall: ${scored.overallScore}`);

      if (scored.overallScore < 70) {
        console.warn(`[SKIP] Score too low (${scored.overallScore} < 70)`);
        await prisma.seoKeyword.update({ where: { id: kw.id }, data: { status: "failed" } });
        skipped++;
        continue;
      }

      // Step 4: Save to DB with slug collision handling
      const baseSlug = article.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 80);

      let slug = baseSlug;
      let saved = false;

      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          await prisma.article.create({
            data: {
              slug,
              title: article.title,
              description: article.description,
              body: article.body,
              vertical: "pm",
              tags: [kw.keyword, "lenny-podcast-insights", kw.pageType],
              seoScore: scored.seoScore,
              published: true,
              publishedAt: new Date(),
              wordCount: article.body.split(/\s+/).length,
              sourceUrls: [],
            },
          });
          saved = true;
          break;
        } catch (err: any) {
          if (err.code === "P2002" || err.message?.includes("Unique constraint")) {
            slug = `${baseSlug}-${Date.now().toString(36)}`;
            console.warn(`[RETRY] Slug collision, trying: ${slug}`);
          } else {
            throw err;
          }
        }
      }

      if (!saved) {
        console.error(`[ERROR] Could not save after 3 slug attempts`);
        await prisma.seoKeyword.update({ where: { id: kw.id }, data: { status: "failed" } });
        skipped++;
        continue;
      }

      // Mark keyword as generated
      await prisma.seoKeyword.update({ where: { id: kw.id }, data: { status: "generated" } });

      console.log(`[SUCCESS] Published -> /learn/pm/${slug}`);
      published.push(article.title);

    } catch (err: any) {
      console.error(`[ERROR] ${err.message}`);
      await prisma.seoKeyword.update({ where: { id: kw.id }, data: { status: "failed" } }).catch(() => {});
      skipped++;
    }
  }

  // Final stats
  const totalArticles = await prisma.article.count({ where: { vertical: "pm" } });

  console.log("\n\n=== BATCH COMPLETE ===");
  console.log(`Published: ${published.length}`);
  console.log(`Skipped/Failed: ${skipped}`);
  console.log(`\nPublished titles:`);
  published.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));
  console.log(`\nTotal PM articles in DB: ${totalArticles}`);

  await prisma.$disconnect();
}

run().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
