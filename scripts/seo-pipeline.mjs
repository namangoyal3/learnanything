#!/usr/bin/env node
/**
 * scripts/seo-pipeline.mjs — SEO automation pipeline v2, one run = one cycle.
 *
 * v1 core (unchanged): sitemap → IndexNow (only when URL set changed) →
 * Bing/Mojeek rank checks (+ Google via headless Chrome when available) →
 * history + trend report.
 *
 * v2 (spec: ~/.cache/seo-best-practices-2026.md):
 *   • Portfolio circuit breaker (§3): sitemap-indexed% < 30 ⇒ publishing halted
 *     (enforced in scripts/publish-seo-articles.ts via scripts/seo/gates.mjs;
 *     reported here every run). Falls back to scripts/seo/gsc-manual.json,
 *     else fails closed.
 *   • Per-cluster 30/60/90-day impressions-led verdicts (§3) from GSC.
 *   • Long-tail per-cluster rank tracking replaces the 8 head terms (§4);
 *     head terms still available via --vanity.
 *   • Prune planning (§5): --prune-plan writes scripts/seo/prune-manifest.json
 *     (plan only). --prune hands the manifest to the gated executor — NEVER
 *     run by cron; requires a human review first.
 *
 * Usage:
 *   node scripts/seo-pipeline.mjs                         # cron cycle (cron.sh-compatible)
 *     [--no-indexnow] [--no-google]                       # v1 flags, unchanged
 *     [--dry-run]                                         # no IndexNow submit, no state writes
 *     [--vanity]                                          # also rank-check the old 8 head terms
 *     [--prune-plan] [--crawl-sample N]                   # build prune manifest (plan only)
 *     [--refresh-graph]                                   # full site crawl → link-graph cache, then exit
 *     [--gate-check <candidate.json>]                     # run v2 publish gates on a candidate, then exit
 *     [--prune]                                           # execute prune artifacts — HUMAN ONLY, see prune.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { THRESHOLDS } from "./seo/config.mjs";
import { loadClusters, saveClusters, computeClusterVerdict } from "./seo/clusters.mjs";
import { gscIndexedPct, gscClusterMetrics, gscPageRows } from "./seo/gsc-pages.mjs";
import { circuitBreakerState } from "./seo/gates.mjs";
import { buildSiteGraph, graphStats } from "./seo/crawl.mjs";
import { buildPruneManifest, executePrune } from "./seo/prune.mjs";
import { sameIntent, isJevConfigured } from "./seo/same-intent.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://learnanything.pro";
const HOST = "learnanything.pro";
const INDEXNOW_KEY = "6c4abe7e9345accd405ac3549b82cd1d"; // public by protocol design (served at /<key>.txt)
const HISTORY_FILE = join(ROOT, "scripts", "seo-rank-history.json");
const MAX_RANK = THRESHOLDS.MAX_RANK;

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const argValue = (f) => {
  const i = args.indexOf(f);
  return i >= 0 && args[i + 1] ? args[i + 1] : null;
};
const DRY = has("--dry-run");

// ── keywords: per-cluster long-tail (v2 §4); head terms only with --vanity ───
const clustersCfg = loadClusters();
const KEYWORD_ROWS = clustersCfg.clusters.flatMap((c) =>
  (c.longTailKeywords || []).map((kw) => ({ kw, cluster: c.id }))
).slice(0, THRESHOLDS.RANK_KEYWORDS_PER_RUN);
if (has("--vanity")) {
  KEYWORD_ROWS.push(...(clustersCfg.headTerms || []).map((kw) => ({ kw, cluster: "(head-term)" })));
}
const KEYWORDS = KEYWORD_ROWS.map((r) => r.kw);
const clusterOf = Object.fromEntries(KEYWORD_ROWS.map((r) => [r.kw, r.cluster]));

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchText(url, opts = {}) {
  // learnanything.pro cold-starts slowly; undici's default 10s connect timeout
  // caused hard crashes (seo-v2). Retry with generous timeouts instead.
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 90_000);
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
        signal: ctl.signal,
        ...opts,
      });
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      return await res.text();
    } catch (e) {
      lastErr = e;
      if (attempt < 3) await sleep(5_000 * attempt);
    } finally {
      clearTimeout(t);
    }
  }
  throw lastErr;
}

// ── 1. Sitemap ───────────────────────────────────────────────────────────────
async function getSitemapUrls() {
  const xml = await fetchText(`${SITE}/sitemap.xml`);
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

// ── 2. IndexNow ──────────────────────────────────────────────────────────────
async function submitIndexNow(urls, prevHash) {
  const hash = createHash("sha256").update(urls.join("\n")).digest("hex");
  if (hash === prevHash) {
    console.log(`IndexNow: URL set unchanged (${urls.length} urls) — skipping submit`);
    return { hash, submitted: 0 };
  }
  let submitted = 0;
  for (let i = 0; i < urls.length; i += 500) {
    const batch = urls.slice(i, i + 500);
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
        urlList: batch,
      }),
    });
    // 200/202 = accepted
    if (res.status === 200 || res.status === 202) submitted += batch.length;
    else console.error(`IndexNow batch ${i / 500 + 1}: HTTP ${res.status}`);
    await sleep(1000);
  }
  console.log(`IndexNow: submitted ${submitted}/${urls.length} urls`);
  return { hash, submitted };
}

// ── 3. Rank checks ───────────────────────────────────────────────────────────
function rankFromLinks(links) {
  const organic = links.filter(
    (u) => !/mojeek\.com|bing\.com|microsoft|go\.microsoft|google\.[a-z.]+\/|translate\.goog/.test(u)
  );
  const idx = organic.findIndex((u) => u.includes(HOST));
  return idx === -1 || idx >= MAX_RANK ? null : idx + 1;
}

// Bing wraps organic results in /ck/a?...&u=a1<base64url-of-real-url>
function decodeBingUrl(href) {
  const m = href.replace(/&amp;/g, "&").match(/[?&]u=a1([^&]+)/);
  if (!m) return href;
  try {
    return Buffer.from(m[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
  } catch {
    return href;
  }
}

async function bingRank(keyword) {
  const html = await fetchText(`https://www.bing.com/search?q=${encodeURIComponent(keyword)}&count=30`);
  const links = [...html.matchAll(/<li class="b_algo"[\s\S]*?<a[^>]*href="([^"]+)"/g)].map((m) =>
    decodeBingUrl(m[1])
  );
  return rankFromLinks(links);
}

async function mojeekRank(keyword) {
  const html = await fetchText(`https://www.mojeek.com/search?q=${encodeURIComponent(keyword)}`);
  const links = [...html.matchAll(/<h2><a[^>]+href="(http[^"]+)"/g)].map((m) => m[1]);
  return rankFromLinks(links);
}

// ── Google via real browser ──────────────────────────────────────────────────
// Returns { ranks: {kw: rank|null}, indexed: number|null, ok: boolean }.
// ponytail: top-10 only (1 page per keyword) — paginating to 30 triples the
// request volume and is what gets an IP flagged.
async function googleCheck(keywords) {
  let browser;
  try {
    const { chromium } = await import("playwright");
    browser = await chromium.launch({
      headless: true,
      channel: "chrome",
      args: ["--disable-blink-features=AutomationControlled"],
    });
  } catch (e) {
    console.error(`Google check skipped (no playwright/Chrome): ${e.message.split("\n")[0]}`);
    return { ranks: {}, indexed: null, ok: false };
  }
  const out = { ranks: {}, indexed: null, ok: true };
  try {
    const ctx = await browser.newContext({
      locale: "en-IN",
      viewport: { width: 1440, height: 900 },
      userAgent: UA.replace(/Chrome\/[\d.]+/, "Chrome/131.0.0.0"),
    });
    await ctx.addInitScript(() =>
      Object.defineProperty(navigator, "webdriver", { get: () => undefined })
    );
    const page = await ctx.newPage();

    const serp = async (q) => {
      await page.goto(
        `https://www.google.com/search?q=${encodeURIComponent(q)}&hl=en&gl=in`,
        { waitUntil: "domcontentloaded", timeout: 30000 }
      );
      if (page.url().includes("/sorry/")) throw new Error("CAPTCHA");
      return page.$$eval("#search a:has(h3)", (as) => as.map((a) => a.href)).catch(() => []);
    };

    for (const kw of keywords) {
      try {
        out.ranks[kw] = rankFromLinks(await serp(kw));
      } catch (e) {
        if (e.message === "CAPTCHA") {
          console.error(`Google: CAPTCHA wall at "${kw}" — aborting remaining Google checks`);
          out.ok = false;
          break; // don't keep hammering a flagged IP
        }
        console.error(`google "${kw}": ${e.message}`);
        out.ranks[kw] = null;
      }
      await sleep(4000 + Math.random() * 3000);
    }

    if (out.ok) {
      try {
        const links = await serp(`site:${HOST}`);
        out.indexed = links.filter((u) => u.includes(HOST)).length; // first-page count, floor not total
      } catch {
        /* keep null */
      }
    }
  } finally {
    await browser.close();
  }
  return out;
}

async function bingIndexedCount() {
  try {
    const html = await fetchText(`https://www.bing.com/search?q=${encodeURIComponent(`site:${HOST}`)}`);
    const m = html.match(/([\d,]+)\s+results/i);
    if (m) return parseInt(m[1].replace(/,/g, ""), 10);
    return /b_no|no results found for/i.test(html) ? 0 : null;
  } catch {
    return null;
  }
}

// ── 4. History + trend ───────────────────────────────────────────────────────
function loadHistory() {
  return existsSync(HISTORY_FILE) ? JSON.parse(readFileSync(HISTORY_FILE, "utf8")) : { runs: [] };
}

function fmt(rank) {
  return rank === null || rank === undefined ? "—" : `#${rank}`;
}

function delta(prev, cur) {
  if (prev == null && cur == null) return "";
  if (prev == null) return " (NEW ✅)";
  if (cur == null) return " (dropped ❌)";
  if (cur < prev) return ` (▲${prev - cur})`;
  if (cur > prev) return ` (▼${cur - prev})`;
  return " (=)";
}

// ── v2 one-shot modes (exit before the measurement cycle) ────────────────────
if (has("--refresh-graph")) {
  const urls = await getSitemapUrls();
  const graph = await buildSiteGraph(urls, { limit: argValue("--crawl-sample") ? Number(argValue("--crawl-sample")) : null });
  const stats = graphStats(graph);
  const counts = Object.values(stats.inlinkCounts);
  console.log(
    `graph: ${counts.length} pages · orphans (0 contextual inlinks): ${stats.orphans.length} · pages with ≥${THRESHOLDS.MIN_INLINKS} inlinks: ${counts.filter((c) => c >= THRESHOLDS.MIN_INLINKS).length} · unreachable from home ≤${THRESHOLDS.MAX_CLICK_DEPTH} clicks: ${counts.length - Object.values(stats.depths).filter((d) => d <= THRESHOLDS.MAX_CLICK_DEPTH).length}`
  );
  process.exit(0);
}

if (argValue("--gate-check")) {
  const { runV2PublishGates } = await import("./seo/publisher-gates.mjs");
  const candidate = JSON.parse(readFileSync(argValue("--gate-check"), "utf8"));
  const result = await runV2PublishGates({
    title: candidate.title,
    body: candidate.body,
    cluster: candidate.cluster,
    inlinkFrom: candidate.inlinkFrom ?? [],
  });
  console.log(`\n=== v2 gate check: ${candidate.title ?? argValue("--gate-check")} ===`);
  for (const g of result.gates) console.log(`  ${g.pass ? "✓" : "✗"} ${g.id.padEnd(18)} ${g.detail}`);
  console.log(result.pass ? "\nPASS — publishable" : "\nBLOCKED");
  process.exit(result.pass ? 0 : 2);
}

if (has("--prune")) {
  // HUMAN-ONLY path. executePrune refuses stale/missing manifests; see prune.mjs.
  const res = executePrune({ confirm: true });
  console.log(`prune artifacts written: ${res.wrote.join(", ")} (${JSON.stringify(res.counts)})`);
  console.log("Nothing is live yet — follow seo-drafts/prune-runbook.md to deploy.");
  process.exit(0);
}

// ── main measurement cycle ───────────────────────────────────────────────────
const history = loadHistory();
const prev = history.runs.at(-1);

const urls = await getSitemapUrls();
console.log(`Sitemap: ${urls.length} urls${DRY ? " (dry-run: no submits, no state writes)" : ""}`);

let indexnow = { hash: prev?.sitemapHash ?? null, submitted: 0 };
if (!process.argv.includes("--no-indexnow") && !DRY) {
  try {
    indexnow = await submitIndexNow(urls, prev?.sitemapHash);
  } catch (e) {
    console.error(`IndexNow failed: ${e.message}`);
  }
} else if (DRY) {
  console.log("IndexNow: skipped (--dry-run)");
}

// v2 §3: circuit breaker — the publisher enforces it; the pipeline reports it.
const indexedHealth = await gscIndexedPct();
const breaker = circuitBreakerState(indexedHealth.pct);
console.log(
  `\nCircuit breaker: ${breaker.halted ? "⛔ PUBLISHING HALTED" : "✅ open"} — ${breaker.reason} [source: ${indexedHealth.source}]`
);

// v2 §3: per-cluster impressions-led verdicts.
const clusterMetrics = await gscClusterMetrics(clustersCfg);
const verdicts = {};
if (clusterMetrics) {
  console.log(`\n${"cluster".padEnd(22)} ${"imp 30d".padStart(8)} ${"prev".padStart(8)} ${"clicks".padStart(7)}  stage/verdict`);
  for (const c of clustersCfg.clusters) {
    const m = clusterMetrics[c.id];
    const ageDays = c.firstPublishedAt ? (Date.now() - new Date(c.firstPublishedAt).getTime()) / 864e5 : null;
    const v = computeClusterVerdict({
      ageDays,
      impressions30d: m.impressions30d,
      impressionsPrev30d: m.impressionsPrev30d,
      indexedPct: indexedHealth.pct,
      hasTop30Query: m.hasTop30Query,
    });
    verdicts[c.id] = { ...v, metrics: m };
    const eff = c.status === "frozen" || c.status === "killed" ? `${v.verdict} (pinned: ${c.status})` : v.verdict;
    console.log(`${c.id.padEnd(22)} ${String(m.impressions30d).padStart(8)} ${String(m.impressionsPrev30d).padStart(8)} ${String(m.clicks30d).padStart(7)}  ${v.stage} → ${eff} — ${v.reason}`);
    if (!DRY && c.status !== "frozen" && c.status !== "killed") {
      c.lastVerdict = { at: new Date().toISOString(), ...v };
      if (v.verdict === "kill") c.status = "killed";
      if (v.verdict === "freeze") c.status = "frozen";
    }
  }
  if (!DRY) saveClusters(clustersCfg);
} else {
  console.log("Cluster verdicts: skipped (no GSC page data and no manual fallback)");
}

// v1: rank checks — now per-cluster long-tail terms.
const ranks = {};
for (const kw of KEYWORDS) {
  const [bing, mojeek] = [
    await bingRank(kw).catch((e) => (console.error(`bing "${kw}": ${e.message}`), null)),
    await mojeekRank(kw).catch((e) => (console.error(`mojeek "${kw}": ${e.message}`), null)),
  ];
  ranks[kw] = { bing, mojeek };
  await sleep(4000); // mojeek 403s ~8 rapid queries; 4s keeps it under the limit
}

const google = process.argv.includes("--no-google")
  ? { ranks: {}, indexed: null, ok: false }
  : await googleCheck(KEYWORDS);
for (const kw of KEYWORDS) ranks[kw].google = google.ranks[kw] ?? null;

const indexed = await bingIndexedCount();

// Real Google Search Console truth (indexed count + impressions); null if creds absent.
const { gscMetrics } = await import("./gsc-metrics.mjs");
const gsc = indexedHealth.source === "gsc-api" ? indexedHealth.raw : await gscMetrics();

const run = {
  ts: new Date().toISOString(),
  sitemapUrls: urls.length,
  sitemapHash: indexnow.hash,
  indexnowSubmitted: indexnow.submitted,
  bingIndexed: indexed,
  googleChecked: google.ok,
  googleIndexedFirstPage: google.indexed,
  gsc,
  gscIndexedPct: indexedHealth.pct,
  circuitBreaker: breaker,
  clusterVerdicts: verdicts,
  ranks,
};
if (!DRY) {
  history.runs.push(run);
  if (history.runs.length > 500) history.runs = history.runs.slice(-500);
  writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

// ── report ───────────────────────────────────────────────────────────────────
console.log(`\n=== SEO pipeline run ${run.ts}${DRY ? " (dry-run)" : ""} ===`);
console.log(`Bing indexed (site:): ${indexed ?? "unknown"}${prev?.bingIndexed != null && indexed != null ? ` (was ${prev.bingIndexed})` : ""}`);
console.log(
  `Google indexed, page 1 of site: ${google.ok ? google.indexed ?? "unknown" : "not checked"}${prev?.googleIndexedFirstPage != null && google.indexed != null ? ` (was ${prev.googleIndexedFirstPage})` : ""}`
);
if (gsc) {
  const pg = prev?.gsc;
  console.log(
    `GSC (real): sitemap indexed ${gsc.sitemapIndexed}/${gsc.sitemapSubmitted}${pg?.sitemapIndexed != null ? ` (was ${pg.sitemapIndexed})` : ""} · 28d impressions ${gsc.impressions}${pg?.impressions != null ? ` (was ${pg.impressions})` : ""} · clicks ${gsc.clicks}${gsc.topQuery ? ` · top "${gsc.topQuery.q}" pos ${gsc.topQuery.pos}` : ""}`
  );
} else {
  console.log(`GSC (real): not checked (no creds in this env)`);
}
console.log(`\n${"keyword [cluster]".padEnd(58)} ${"Google".padEnd(14)} ${"Bing".padEnd(14)} Mojeek`);
for (const kw of KEYWORDS) {
  const p = prev?.ranks?.[kw];
  const c = ranks[kw];
  const g = google.ok ? fmt(c.google) + delta(p?.google, c.google) : "n/a";
  console.log(
    `${`${kw} [${clusterOf[kw]}]`.padEnd(58)} ${g.padEnd(14)} ${(fmt(c.bing) + delta(p?.bing, c.bing)).padEnd(14)} ${fmt(c.mojeek)}${delta(p?.mojeek, c.mojeek)}`
  );
}
const ranked = KEYWORDS.filter(
  (k) => ranks[k].bing != null || ranks[k].mojeek != null || ranks[k].google != null
).length;
console.log(`\nRanked in top ${MAX_RANK}: ${ranked}/${KEYWORDS.length} keywords · history: ${history.runs.length} runs → ${HISTORY_FILE}`);

// v2 §5: prune plan (manifest only — execution is behind --prune, human-only).
if (has("--prune-plan")) {
  console.log(`\n=== prune plan ===`);
  const sample = argValue("--crawl-sample") ? Number(argValue("--crawl-sample")) : null;
  const graph = await buildSiteGraph(urls, { limit: sample });
  const [pages90d, pages16mo] = [
    await gscPageRows({ startDaysAgo: 92 }),
    await gscPageRows({ startDaysAgo: 480 }),
  ];
  const manifest = await buildPruneManifest({ sitemapUrls: urls, pages90d, pages16mo, graph, clusters: clustersCfg, judge: isJevConfigured() ? sameIntent : null });
  console.log(
    `prune manifest → scripts/seo/prune-manifest.json · total ${manifest.counts.total} · keep ${manifest.counts.keep} · kill(410) ${manifest.counts.kill} · target ${manifest.counts.target}${manifest.counts.onTarget ? "" : " ⚠ off-target — review criteria"}`
  );
  console.log(`per-cluster: ${Object.entries(manifest.perCluster).map(([k, v]) => `${k} ${v.keep}/${v.keep + v.kill}`).join(" · ")}`);
  console.log("NOT executing — review manifest, then a human may run: node scripts/seo-pipeline.mjs --prune");
}
