/**
 * scripts/seo/publisher-gates.mjs — the one entry point the DB publisher
 * (scripts/publish-seo-articles.ts) calls before inserting an article.
 * Assembles gate context (sitemap, crawl graph, ledger, GSC health, cluster
 * config) and delegates to runPublishGates(). Also owns the publish ledger.
 *
 * Dedupe scope: candidate is compared against pages in its own cluster plus
 * all non-/learn top-level pages, capped at 400 texts — nearest neighbours of
 * a templated article are overwhelmingly in-cluster, and capping keeps a
 * publish check under ~10s with cached embeddings.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { FILES } from "./config.mjs";
import { getSitemapUrls, toPath, graphStats } from "./crawl.mjs";
import { loadClusters, assignCluster } from "./clusters.mjs";
import { gscIndexedPct } from "./gsc-pages.mjs";
import { runPublishGates } from "./gates.mjs";

export function loadLedger() {
  if (!existsSync(FILES.LEDGER)) return { publishes: [] };
  try {
    return JSON.parse(readFileSync(FILES.LEDGER, "utf8"));
  } catch {
    return { publishes: [] };
  }
}

export function recordPublish({ slug, cluster, url }) {
  const ledger = loadLedger();
  ledger.publishes.push({ ts: new Date().toISOString(), slug, cluster, url });
  writeFileSync(FILES.LEDGER, JSON.stringify(ledger, null, 2) + "\n");
  // Bump the cluster's probe-batch counter too.
  try {
    const clusters = loadClusters();
    const c = clusters.clusters.find((c) => c.id === cluster);
    if (c) {
      c.probeBatch ??= { published: 0, startedAt: null };
      c.probeBatch.published++;
      c.probeBatch.startedAt ??= new Date().toISOString();
      writeFileSync(FILES.CLUSTERS, JSON.stringify(clusters, null, 2) + "\n");
    }
  } catch {
    /* ledger entry is the source of truth; cluster counter is advisory */
  }
}

export async function runV2PublishGates({ title, body, cluster, inlinkFrom }) {
  const clusters = loadClusters();
  const clusterCfg = clusters.clusters.find((c) => c.id === cluster) ?? null;

  const sitemapPaths = new Set((await getSitemapUrls()).map(toPath).filter(Boolean));

  let depths = null;
  let existingPages = [];
  if (existsSync(FILES.GRAPH_CACHE)) {
    const graph = { pages: JSON.parse(readFileSync(FILES.GRAPH_CACHE, "utf8")).pages ?? {} };
    depths = graphStats(graph).depths;
    const all = Object.entries(graph.pages).filter(([, v]) => v.text);
    const inCluster = all.filter(([p]) => assignCluster(p, clusters) === cluster);
    const topLevel = all.filter(([p]) => !p.startsWith("/learn/"));
    const seen = new Set();
    existingPages = [...inCluster, ...topLevel]
      .filter(([p]) => (seen.has(p) ? false : seen.add(p)))
      .slice(0, 400)
      .map(([p, v]) => ({ path: p, title: v.title, text: v.text }));
  }

  const { pct } = await gscIndexedPct();

  return runPublishGates(
    { title, body, cluster, inlinkFrom },
    {
      sitemapPaths,
      depths,
      existingPages,
      ledgerTimestamps: loadLedger().publishes.map((p) => p.ts),
      clusterCfg,
      indexedPct: pct,
    }
  );
}
