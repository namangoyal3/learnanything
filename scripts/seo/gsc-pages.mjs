/**
 * scripts/seo/gsc-pages.mjs — page-level + per-cluster GSC data for the
 * circuit breaker (§3), cluster gates (§3), long-tail tracking (§4) and the
 * prune manifest (§5). Reuses the stdlib JWT signer from scripts/gsc-metrics.mjs.
 *
 * Every function degrades to null (never throws to callers) when creds are
 * absent; gscIndexedPct() additionally falls back to the manual-input file
 * scripts/seo/gsc-manual.json ({ "indexedPct": <number> }) so the circuit
 * breaker still works in cred-less environments. Gates treat null as
 * "unknown" and fail closed.
 */
import { readFileSync, existsSync } from "node:fs";
import { accessToken, gscMetrics } from "../gsc-metrics.mjs";
import { FILES } from "./config.mjs";
import { toPath } from "./crawl.mjs";
import { assignCluster } from "./clusters.mjs";

const SITE_PROP = process.env.GSC_SITE_URL;
const RAW_KEY = process.env.GA4_SERVICE_ACCOUNT_KEY;

async function saQuery(body) {
  if (!SITE_PROP || !RAW_KEY) return null;
  try {
    const tok = await accessToken(JSON.parse(RAW_KEY));
    const res = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE_PROP)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${tok}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) throw new Error(`searchAnalytics ${res.status}`);
    return (await res.json()).rows || [];
  } catch (e) {
    console.error(`GSC query skipped: ${e.message.split("\n")[0]}`);
    return null;
  }
}

const daysAgo = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);

/** Per-page rows over a window. GSC caps ranges at ~16 months. */
export async function gscPageRows({ startDaysAgo = 92, endDaysAgo = 2, rowLimit = 25000 } = {}) {
  const rows = await saQuery({
    startDate: daysAgo(startDaysAgo),
    endDate: daysAgo(endDaysAgo),
    dimensions: ["page"],
    rowLimit,
  });
  return rows?.map((r) => ({
    path: toPath(r.keys[0]),
    impressions: r.impressions,
    clicks: r.clicks,
    position: r.position,
  })) ?? null;
}

/**
 * Page × query rows over a window — the "open a page and inspect its Queries
 * tab" export the internal-linking playbook (§6) starts from.
 */
export async function gscPageQueryRows({ startDaysAgo = 92, endDaysAgo = 2, rowLimit = 25000 } = {}) {
  const rows = await saQuery({
    startDate: daysAgo(startDaysAgo),
    endDate: daysAgo(endDaysAgo),
    dimensions: ["page", "query"],
    rowLimit,
  });
  return rows?.map((r) => ({
    path: toPath(r.keys[0]),
    query: r.keys[1],
    impressions: r.impressions,
    clicks: r.clicks,
    position: Math.round(r.position * 10) / 10,
  })) ?? null;
}

/** Top queries whose landing page starts with the cluster's URL space. */
export async function gscTopQueriesForPattern(pattern, { days = 30, limit = 25 } = {}) {
  const rows = await saQuery({
    startDate: daysAgo(days + 2),
    endDate: daysAgo(2),
    dimensions: ["query", "page"],
    rowLimit: 250,
  });
  if (!rows) return null;
  const re = new RegExp(pattern);
  return rows
    .filter((r) => re.test(toPath(r.keys[1]) || ""))
    .slice(0, limit)
    .map((r) => ({ query: r.keys[0], impressions: r.impressions, clicks: r.clicks, position: Math.round(r.position * 10) / 10 }));
}

/**
 * Per-cluster impressions for current 30d + previous 30d, plus whether any
 * query already sits in the top 30 — exactly what computeClusterVerdict needs.
 */
export async function gscClusterMetrics(clusters) {
  const [cur, prevRows] = await Promise.all([
    saQuery({ startDate: daysAgo(32), endDate: daysAgo(2), dimensions: ["page", "query"], rowLimit: 25000 }),
    saQuery({ startDate: daysAgo(62), endDate: daysAgo(33), dimensions: ["page"], rowLimit: 25000 }),
  ]);
  if (!cur && !prevRows) return null;
  const zero = () => ({ impressions30d: 0, impressionsPrev30d: 0, clicks30d: 0, hasTop30Query: false, pagesWithImpressions: 0 });
  const byCluster = Object.fromEntries(clusters.clusters.map((c) => [c.id, zero()]));
  const pageSeen = {};
  for (const r of cur || []) {
    const cid = assignCluster(toPath(r.keys[0]) || "", clusters);
    if (!cid) continue;
    const m = byCluster[cid];
    m.impressions30d += r.impressions;
    m.clicks30d += r.clicks;
    if (r.position <= 30 && r.impressions >= 3) m.hasTop30Query = true;
    if (!pageSeen[r.keys[0]] && r.impressions > 0) {
      pageSeen[r.keys[0]] = true;
      m.pagesWithImpressions++;
    }
  }
  for (const r of prevRows || []) {
    const cid = assignCluster(toPath(r.keys[0]) || "", clusters);
    if (cid) byCluster[cid].impressionsPrev30d += r.impressions;
  }
  return byCluster;
}

/**
 * Portfolio indexed% for the circuit breaker.
 * Order: GSC sitemaps API → manual fallback file → null (= fail closed).
 */
export async function gscIndexedPct() {
  const gsc = await gscMetrics();
  if (gsc?.sitemapIndexed != null && gsc?.sitemapSubmitted) {
    return { pct: (gsc.sitemapIndexed / gsc.sitemapSubmitted) * 100, source: "gsc-api", raw: gsc };
  }
  if (existsSync(FILES.GSC_MANUAL)) {
    try {
      const manual = JSON.parse(readFileSync(FILES.GSC_MANUAL, "utf8"));
      if (typeof manual.indexedPct === "number") {
        return { pct: manual.indexedPct, source: "manual-json", raw: manual };
      }
    } catch {
      /* fall through */
    }
  }
  return { pct: null, source: "none", raw: gsc };
}
