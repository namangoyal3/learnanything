/**
 * Multi-source PM job scraper. Pulls from:
 *   1. Himalayas.app  — public JSON API
 *   2. Remotive.com   — free JSON API (remote jobs)
 *   3. We Work Remotely — RSS feed (product category)
 *   4. Remote OK      — free JSON API
 *
 * Safe to re-run — deduplicates by applyUrl, refreshes existing, deactivates stale.
 *
 * Usage:
 *   npx tsx scripts/scrape-pm-jobs.ts            # live run (all sources)
 *   npx tsx scripts/scrape-pm-jobs.ts --dry-run  # preview only
 *   npx tsx scripts/scrape-pm-jobs.ts --source himalayas  # one source
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import Parser from "rss-parser";

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
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (process.env[k] === undefined) process.env[k] = v;
  }
}

const prisma = new PrismaClient();
const rssParser = new Parser({ timeout: 10000 });
const dryRun = process.argv.includes("--dry-run");
const sourceArg = process.argv.find((a, i) => process.argv[i - 1] === "--source");

// ─── Title filter ───────────────────────────────────────────────────────────

const PM_TITLE_PATTERNS = [
  // Core PM
  "product manager", "product management", "product lead",
  "head of product", "vp of product", "vp, product", "vp product",
  "director of product", "director, product",
  "principal pm", "group pm", "staff pm", "senior pm", "sr. pm",
  "associate product", "associate pm", "apm",
  "growth pm", "ai pm", "founding pm",
  // Builder / AI-adjacent
  "full stack", "fullstack", "full-stack",
  "founding engineer", "ai engineer", "ml engineer",
  "product engineer", "product ops", "product operations",
  "product strategy", "product analyst",
];

function isPMJob(title: string): boolean {
  const t = title.toLowerCase();
  return PM_TITLE_PATTERNS.some((p) => t.includes(p));
}

function extractTags(title: string, extra: string[] = []): string[] {
  const tags = new Set<string>(extra.slice(0, 3));
  const t = title.toLowerCase();
  if (t.includes("senior") || t.includes("sr.") || t.includes("staff")) tags.add("Senior");
  if (t.includes("principal")) tags.add("Principal");
  if (t.includes("director") || t.includes("head of") || t.includes("vp")) tags.add("Leadership");
  if (t.includes("growth")) tags.add("Growth PM");
  if (t.includes("ai ") || t.includes(" ai") || t.includes("machine learning") || t.includes("ml")) tags.add("AI PM");
  if (t.includes("full stack") || t.includes("fullstack") || t.includes("full-stack")) tags.add("Full Stack");
  if (t.includes("founding")) tags.add("Founding");
  if (t.includes("associate") || t.includes("apm")) tags.add("APM");
  if (t.includes("data") || t.includes("analytics")) tags.add("Data PM");
  if (t.includes("platform")) tags.add("Platform PM");
  if (!tags.size) tags.add("PM");
  return Array.from(tags).slice(0, 5);
}

// ─── Normalised job shape ────────────────────────────────────────────────────

interface NormJob {
  title: string;
  company: string;
  applyUrl: string;
  description: string | null;
  remote: boolean;
  location: string | null;
  tags: string[];
  postedAt: Date | null;
  source: string;
}

// ─── Source 1: Himalayas ─────────────────────────────────────────────────────

interface HimalayasJob {
  title: string;
  companyName: string;
  applicationLink: string;
  excerpt?: string | null;
  categories?: string[];
  seniority?: string[];
  pubDate?: string | null;
  locationRestrictions?: string[];
}

async function fetchHimalayas(): Promise<NormJob[]> {
  const queries = ["product manager", "AI product manager", "full stack engineer"];
  const seen = new Set<string>();
  const all: NormJob[] = [];

  for (const q of queries) {
    const url = `https://himalayas.app/jobs/api?q=${encodeURIComponent(q)}&limit=30`;
    try {
      const res = await fetch(url, { headers: { "User-Agent": "pm-streak-bot/1.0" }, signal: AbortSignal.timeout(8000) });
      if (!res.ok) { console.warn(`  ⚠ Himalayas ${res.status} for "${q}"`); continue; }
      const data = await res.json() as { jobs?: HimalayasJob[] };
      for (const j of data.jobs ?? []) {
        if (!j.applicationLink || seen.has(j.applicationLink)) continue;
        seen.add(j.applicationLink);
        all.push({
          title: j.title,
          company: j.companyName,
          applyUrl: j.applicationLink,
          description: j.excerpt ? j.excerpt.slice(0, 500) : null,
          remote: !j.locationRestrictions?.length,
          location: j.locationRestrictions?.join(", ") || null,
          tags: extractTags(j.title, [...(j.categories ?? []).slice(0, 2), ...(j.seniority ?? []).slice(0, 1)]),
          postedAt: j.pubDate ? new Date(j.pubDate) : null,
          source: "himalayas",
        });
      }
    } catch (err) {
      console.warn(`  ⚠ Himalayas failed for "${q}":`, err instanceof Error ? err.message : String(err));
    }
  }
  return all;
}

// ─── Source 2: Remotive ──────────────────────────────────────────────────────

interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  description: string;
  candidate_required_location?: string;
  tags?: string[];
  publication_date?: string;
}

async function fetchRemotive(): Promise<NormJob[]> {
  const categories = ["product", "all"];
  const seen = new Set<string>();
  const all: NormJob[] = [];

  for (const cat of categories) {
    const url = `https://remotive.com/api/remote-jobs?category=${cat}&limit=50`;
    try {
      const res = await fetch(url, { headers: { "User-Agent": "pm-streak-bot/1.0" }, signal: AbortSignal.timeout(8000) });
      if (!res.ok) { console.warn(`  ⚠ Remotive ${res.status} for category "${cat}"`); continue; }
      const data = await res.json() as { jobs?: RemotiveJob[] };
      for (const j of data.jobs ?? []) {
        if (!j.url || seen.has(j.url)) continue;
        seen.add(j.url);
        all.push({
          title: j.title,
          company: j.company_name,
          applyUrl: j.url,
          description: j.description ? j.description.replace(/<[^>]+>/g, "").slice(0, 500) : null,
          remote: true,
          location: j.candidate_required_location ?? null,
          tags: extractTags(j.title, j.tags?.slice(0, 2) ?? []),
          postedAt: j.publication_date ? new Date(j.publication_date) : null,
          source: "remotive",
        });
      }
    } catch (err) {
      console.warn(`  ⚠ Remotive failed:`, err instanceof Error ? err.message : String(err));
    }
  }
  return all;
}

// ─── Source 3: We Work Remotely RSS ──────────────────────────────────────────

async function fetchWeWorkRemotely(): Promise<NormJob[]> {
  const feeds = [
    "https://weworkremotely.com/categories/remote-product-jobs.rss",
    "https://weworkremotely.com/categories/remote-full-stack-programming-jobs.rss",
  ];
  const all: NormJob[] = [];

  for (const feedUrl of feeds) {
    try {
      const feed = await rssParser.parseURL(feedUrl);
      for (const item of feed.items) {
        const title = item.title?.trim() ?? "";
        const url = item.link?.trim() ?? "";
        if (!url) continue;
        // WWR titles often include company: "Company: Role Title"
        const colonIdx = title.indexOf(":");
        const role = colonIdx > -1 ? title.slice(colonIdx + 1).trim() : title;
        const company = colonIdx > -1 ? title.slice(0, colonIdx).trim() : "Unknown";
        all.push({
          title: role,
          company,
          applyUrl: url,
          description: item.contentSnippet ? item.contentSnippet.slice(0, 500) : null,
          remote: true,
          location: null,
          tags: extractTags(role),
          postedAt: item.pubDate ? new Date(item.pubDate) : null,
          source: "weworkremotely",
        });
      }
    } catch (err) {
      console.warn(`  ⚠ We Work Remotely RSS failed:`, err instanceof Error ? err.message : String(err));
    }
  }
  return all;
}

// ─── Source 4: Remote OK ─────────────────────────────────────────────────────

interface RemoteOKJob {
  id: string;
  url: string;
  position: string;
  company: string;
  description?: string;
  location?: string;
  tags?: string[];
  date?: string;
}

async function fetchRemoteOK(): Promise<NormJob[]> {
  const tags = ["product-manager", "ai", "full-stack"];
  const seen = new Set<string>();
  const all: NormJob[] = [];

  for (const tag of tags) {
    const url = `https://remoteok.com/api?tag=${tag}`;
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "pm-streak-bot/1.0", "Accept": "application/json" },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) { console.warn(`  ⚠ Remote OK ${res.status} for tag "${tag}"`); continue; }
      const data = await res.json() as RemoteOKJob[];
      // First element is metadata, skip it
      for (const j of data.slice(1)) {
        if (!j.url || seen.has(j.url)) continue;
        seen.add(j.url);
        all.push({
          title: j.position,
          company: j.company,
          applyUrl: j.url,
          description: j.description ? j.description.replace(/<[^>]+>/g, "").slice(0, 500) : null,
          remote: true,
          location: j.location ?? null,
          tags: extractTags(j.position, j.tags?.slice(0, 2) ?? []),
          postedAt: j.date ? new Date(j.date) : null,
          source: "remoteok",
        });
      }
    } catch (err) {
      console.warn(`  ⚠ Remote OK failed for "${tag}":`, err instanceof Error ? err.message : String(err));
    }
  }
  return all;
}

// ─── Main ────────────────────────────────────────────────────────────────────

const SOURCES: Record<string, () => Promise<NormJob[]>> = {
  himalayas: fetchHimalayas,
  remotive: fetchRemotive,
  weworkremotely: fetchWeWorkRemotely,
  remoteok: fetchRemoteOK,
};

async function main() {
  console.log(`\n[scrape-pm-jobs] Starting${dryRun ? " (dry-run)" : ""}${sourceArg ? ` — source: ${sourceArg}` : " — all sources"}…\n`);

  const activeSources = sourceArg
    ? Object.entries(SOURCES).filter(([k]) => k === sourceArg)
    : Object.entries(SOURCES);

  const totals: Record<string, { fetched: number; valid: number; created: number; skipped: number }> = {};
  const allActiveUrls: string[] = [];

  for (const [name, fetchFn] of activeSources) {
    console.log(`\n── ${name.toUpperCase()} ──`);
    const raw = await fetchFn();
    const valid = raw.filter((j) => isPMJob(j.title));
    totals[name] = { fetched: raw.length, valid: valid.length, created: 0, skipped: 0 };
    console.log(`  ${raw.length} raw → ${valid.length} valid PM/builder jobs`);

    for (const job of valid) {
      allActiveUrls.push(job.applyUrl);

      if (dryRun) {
        console.log(`  [dry-run] ${job.title} @ ${job.company} (${job.remote ? "remote" : job.location ?? "?"})`);
        continue;
      }

      const existing = await prisma.job.findFirst({ where: { applyUrl: job.applyUrl } });
      if (existing) {
        await prisma.job.update({ where: { id: existing.id }, data: { isActive: true, scrapedAt: new Date() } });
        totals[name].skipped++;
        continue;
      }

      await prisma.job.create({ data: { ...job, isActive: true } });
      console.log(`  ✅ ${job.title} @ ${job.company}`);
      totals[name].created++;
    }
  }

  if (!dryRun && allActiveUrls.length > 0) {
    const sourceNames = activeSources.map(([k]) => k);
    const deactivated = await prisma.job.updateMany({
      where: { source: { in: sourceNames }, applyUrl: { notIn: allActiveUrls } },
      data: { isActive: false },
    });
    console.log(`\nDeactivated stale: ${deactivated.count}`);
  }

  console.log("\n── SUMMARY ──");
  let grandCreated = 0;
  for (const [name, t] of Object.entries(totals)) {
    console.log(`  ${name.padEnd(16)} fetched: ${t.fetched.toString().padStart(3)}  valid: ${t.valid.toString().padStart(3)}  created: ${t.created.toString().padStart(3)}  refreshed: ${t.skipped}`);
    grandCreated += t.created;
  }
  console.log(`\n  Total new jobs added: ${grandCreated}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
