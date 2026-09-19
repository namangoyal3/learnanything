/**
 * scripts/seo/gsc-pages.mjs — page-level + per-cluster GSC data for the
 * circuit breaker (§3), cluster gates (§3), long-tail tracking (§4) and the
 * prune manifest (§5). Reuses the stdlib JWT signer from scripts/gsc-metrics.mjs.
 *
 * Every function degrades to null (never throws to callers) when creds are
 * absent; gscVisiblePct() additionally falls back to the manual-input file
 * scripts/seo/gsc-manual.json ({ "indexedPct": <number> }) so the circuit
 * breaker still works in cred-less environments. Gates treat null as
 * "unknown" and fail closed.
 */
import { readFileSync, existsSync } from "node:fs";
import { accessToken } from "../gsc-metrics.mjs";
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

// `site:learnanything.pro` probes (the pipeline's own Google check until
// 2026-07-31, plus manual checks) show up in GSC as impressions on every
// indexed page: 74% of all impressions in Jul-Aug 2026, 53% in the last 30d.
// Nobody searched for those pages, so no reader of this module sees them.
const isProbe = (query) => /^site:/i.test(query);

/**
 * Per-page rows over a window, aggregated from page × query rows so probe
 * queries can be dropped. GSC caps ranges at ~16 months.
 */
export async function gscPageRows(opts = {}) {
  const rows = await gscPageQueryRows(opts);
  if (!rows) return null;
  const byPath = new Map();
  for (const r of rows) {
    const p = byPath.get(r.path) ?? { path: r.path, impressions: 0, clicks: 0, posWeighted: 0 };
    p.impressions += r.impressions;
    p.clicks += r.clicks;
    p.posWeighted += r.position * r.impressions;
    byPath.set(r.path, p);
  }
  return [...byPath.values()].map(({ posWeighted, ...p }) => ({ ...p, position: p.impressions ? posWeighted / p.impressions : 0 }));
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
  return rows?.filter((r) => !isProbe(r.keys[1])).map((r) => ({
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
    .filter((r) => !isProbe(r.keys[0]) && re.test(toPath(r.keys[1]) || ""))
    .slice(0, limit)
    .map((r) => ({ query: r.keys[0], impressions: r.impressions, clicks: r.clicks, position: Math.round(r.position * 10) / 10 }));
}

/**
 * Per-cluster impressions for current 30d + previous 30d, plus whether any
 * query already sits in the top 30 — exactly what computeClusterVerdict needs.
 */
export async function gscClusterMetrics(clusters) {
  const [cur, prevRows] = await Promise.all([
    gscPageQueryRows({ startDaysAgo: 32, endDaysAgo: 2 }),
    gscPageRows({ startDaysAgo: 62, endDaysAgo: 33 }),
  ]);
  if (!cur && !prevRows) return null;
  const zero = () => ({ impressions30d: 0, impressionsPrev30d: 0, clicks30d: 0, hasTop30Query: false, pagesWithImpressions: 0 });
  const byCluster = Object.fromEntries(clusters.clusters.map((c) => [c.id, zero()]));
  const pageSeen = {};
  for (const r of cur || []) {
    const cid = assignCluster(r.path || "", clusters);
    if (!cid) continue;
    const m = byCluster[cid];
    m.impressions30d += r.impressions;
    m.clicks30d += r.clicks;
    if (r.position <= 30 && r.impressions >= 3) m.hasTop30Query = true;
    if (!pageSeen[r.path] && r.impressions > 0) {
      pageSeen[r.path] = true;
      m.pagesWithImpressions++;
    }
  }
  for (const r of prevRows || []) {
    const cid = assignCluster(r.path || "", clusters);
    if (cid) byCluster[cid].impressionsPrev30d += r.impressions;
  }
  return byCluster;
}

/**
 * Portfolio indexed% for the circuit breaker.
 * Order: GSC sitemaps API → manual fallback file → null (= fail closed).
 */
/**
 * Portfolio visibility for the circuit breaker: % of sitemap paths with ≥1
 * impression in the last 90d. This used to read the Sitemaps API `indexed`
 * field, which Search Console stopped populating years ago — it reported
 * 0/1393 on every run, so the breaker could never open. Visible% is a lower
 * bound on indexed% that moves when the site changes (2026-09-20: 222/1393).
 */
export async function gscVisiblePct(sitemapPaths) {
  const paths = new Set(sitemapPaths);
  const rows = paths.size ? await gscPageRows({ startDaysAgo: 92 }) : null;
  if (rows) {
    const visible = rows.filter((r) => r.impressions > 0 && paths.has(r.path)).length;
    return { pct: (visible / paths.size) * 100, source: "gsc-visible-90d", raw: { visible, sitemap: paths.size } };
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
  return { pct: null, source: "none", raw: null };
}
