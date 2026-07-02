/**
 * scripts/submit-indexnow.ts
 *
 * CLI script to submit all site URLs to IndexNow for instant indexing.
 * Run after deploys or content updates:
 *
 *   npx tsx scripts/submit-indexnow.ts
 *   npx tsx scripts/submit-indexnow.ts --dry-run
 *
 * Requires:
 *   INDEXNOW_KEY env var
 *   NEXT_PUBLIC_APP_URL env var (defaults to https://learnanything.pro)
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://learnanything.pro";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY;
const DRY_RUN = process.argv.includes("--dry-run");
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH_SIZE = 500;

// Core routes always submitted
const CORE_ROUTES = [
  "/",
  "/learn",
  "/pricing",
  "/explore",
  "/interview-prep",
  "/jobs",
  "/daily-challenge",
  "/leaderboard",
  "/social",
  "/role-roadmaps",
  "/interview-sprint",
  "/invite",
  "/llms.txt",
];

async function getArticleUrls(): Promise<string[]> {
  try {
    const articles = await prisma.article.findMany({
      where: { published: true },
      select: { slug: true, vertical: true },
    });
    return articles.map((a) => `${SITE_URL}/learn/${a.vertical}/${a.slug}`);
  } catch {
    console.error("❌ Failed to query articles from database.");
    return [];
  }
}

async function submitBatch(urls: string[], batchNum: number): Promise<boolean> {
  const host = new URL(SITE_URL).host;
  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  if (DRY_RUN) {
    console.log(`\n  [DRY RUN] Batch ${batchNum}: Would submit ${urls.length} URLs`);
    urls.forEach((u) => console.log(`    ${u}`));
    return true;
  }

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    if (res.ok || res.status === 200 || res.status === 202) {
      console.log(`  ✅ Batch ${batchNum}: ${urls.length} URLs accepted (${res.status})`);
      return true;
    } else {
      const errorText = await res.text().catch(() => "Unknown");
      console.error(`  ❌ Batch ${batchNum}: API returned ${res.status}: ${errorText}`);
      return false;
    }
  } catch (err) {
    console.error(`  ❌ Batch ${batchNum}: Failed to reach IndexNow API:`, err);
    return false;
  }
}

/**
 * Submit a single URL to IndexNow — usable from publishArticle() in safe-prisma.
 * Fire-and-forget; failures are logged but never thrown.
 */
export async function submitSingleUrl(articleUrl: string): Promise<void> {
  if (!INDEXNOW_KEY) return;

  const host = new URL(SITE_URL).host;
  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: [articleUrl],
  };

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    if (!res.ok && res.status !== 200 && res.status !== 202) {
      const errorText = await res.text().catch(() => "Unknown");
      console.error(`[IndexNow] Single URL submit failed (${res.status}): ${errorText} — url: ${articleUrl}`);
    }
  } catch (err) {
    console.error(`[IndexNow] Network error submitting ${articleUrl}:`, err);
  }
}

async function submitToIndexNow() {
  if (!INDEXNOW_KEY) {
    console.error("❌ INDEXNOW_KEY environment variable not set.");
    console.error("   Generate one: openssl rand -hex 16");
    console.error("   Then set it in .env and deploy the key file to /public/{key}.txt");
    process.exit(1);
  }

  const host = new URL(SITE_URL).host;

  console.log(`\n🚀 Submitting URLs to IndexNow...`);
  console.log(`   Host: ${host}`);
  console.log(`   Key: ${INDEXNOW_KEY.slice(0, 8)}...`);
  if (DRY_RUN) console.log(`   Mode: DRY RUN (no API calls)`);

  // Fetch article URLs from DB
  const articleUrls = await getArticleUrls();
  console.log(`\n📊 Found ${articleUrls.length} published articles in DB.`);

  const coreUrls = CORE_ROUTES.map((r) => `${SITE_URL}${r}`);
  const allUrls = [...coreUrls, ...articleUrls];

  console.log(`   Total URLs to submit: ${allUrls.length} (${coreUrls.length} core + ${articleUrls.length} articles)`);

  // Batch submit
  let success = 0;
  let failed = 0;
  const batches = Math.ceil(allUrls.length / BATCH_SIZE);

  for (let i = 0; i < batches; i++) {
    const batch = allUrls.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
    const ok = await submitBatch(batch, i + 1);
    if (ok) success += batch.length;
    else failed += batch.length;
  }

  if (DRY_RUN) {
    console.log(`\n🏁 DRY RUN complete. ${allUrls.length} URLs would have been submitted in ${batches} batch(es).`);
  } else {
    console.log(`\n🏁 Done. ${success} URLs accepted, ${failed} failed.`);
    console.log("   Bing, Yandex, Seznam, and Naver will crawl these URLs.");
    console.log("   Bing index feeds ChatGPT, Perplexity, and Claude.");
  }
}

// Run directly when invoked as CLI script
const isDirect = process.argv[1]?.endsWith("submit-indexnow.ts") || process.argv[1]?.endsWith("submit-indexnow");
if (isDirect) {
  submitToIndexNow()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
