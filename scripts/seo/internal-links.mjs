#!/usr/bin/env node
/**
 * scripts/seo/internal-links.mjs — the "8 internal linking hacks" playbook as
 * a pipeline stage, with TypeSafe Jev supplying the semantic judgments.
 *
 *   1. check Search Console      gscPageQueryRows()  → per-page clicks/impressions/position
 *   2. group your topics         Jev choice over TOPICS (reader's question, not URL)
 *   3. pick your pillars         Jev noul "overview guide?" × impressions, per topic
 *   4. pick money pages          MONEY_PAGES (code) + Jev picks the sentence where they fit
 *   5. pick support posts        fast-search shortlist → Jev noul re-rank (source → destination)
 *   6. boost page-2 pages        GSC position 11–20 + Jev noul "does the page answer the query?"
 *   7. footer pillars/money      plan.footer → SiteFooter.tsx (applied by hand, it is shared chrome)
 *   8. vary link text            Jev choice among 2–5-word windows of the chosen sentence,
 *                                code avoids reusing an anchor per destination
 *
 * Usage:
 *   node scripts/seo/internal-links.mjs                 plan only
 *   node scripts/seo/internal-links.mjs --apply         also edit page.tsx files / Article.body
 *   flags: --limit N   --refresh-graph   --no-gsc
 *
 * Env: TYPESAFE_API_KEY (required); GSC_SITE_URL + GA4_SERVICE_ACCOUNT_KEY
 * (hacks 1 & 6, optional — without them the plan runs on prune-manifest
 * impressions); DATABASE_URL (optional — needed to plan/apply DB articles from
 * their markdown body instead of crawled text).
 *
 * Outputs: scripts/seo/internal-links-plan.json (working list, committed),
 * seo-drafts/internal-links-plan.md (review copy), and on --apply
 * scripts/seo/internal-links-ledger.json (what went live + GSC baseline, so
 * the next run skips it and a later run can compare performance).
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { FILES, ROOT, SITE, THRESHOLDS as T } from "./config.mjs";
import { getSitemapUrls, toPath, buildSiteGraph } from "./crawl.mjs";
import { gscPageQueryRows } from "./gsc-pages.mjs";
import { systemOne, noul, choice, pMap, usage, flushJevCache } from "./jev.mjs";
import {
  TOPICS,
  HUB_PATHS,
  MONEY_PAGES,
  tokens,
  overlap,
  excerpt,
  stripMarkdown,
  tsxProse,
  splitSentences,
  anchorWindows,
  pickAnchor,
  applyToMarkdown,
  applyToTsx,
  tsxPathFor,
} from "./internal-links-lib.mjs";

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n, d) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : d);
const readJson = (f, d) => (existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : d);
const chunk = (arr, n) => Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));
const cleanTitle = (t) => (t || "").replace(/\s*[|—–-]\s*PM Streak.*$/i, "").trim();

async function loadDbArticles() {
  if (!process.env.DATABASE_URL) return { prisma: null, map: new Map() };
  const mod = await import("@prisma/client");
  const PrismaClient = mod.PrismaClient ?? mod.default?.PrismaClient;
  const prisma = new PrismaClient();
  const rows = await prisma.article.findMany({
    where: { published: true },
    select: { slug: true, vertical: true, title: true, description: true, body: true },
  });
  return { prisma, map: new Map(rows.map((a) => [`/learn/${a.vertical}/${a.slug}`, a])) };
}

// --- 0. universe + page records ---------------------------------------------
async function loadPages(db) {
  const manifest = readJson(FILES.PRUNE_MANIFEST, { kill: [] });
  const kill = new Set(manifest.kill.map((k) => k.path));
  const keepImpr = Object.fromEntries(
    (manifest.keep || []).map((k) => [k.path, Number(k.reasons?.find((r) => r.startsWith("impressions90d="))?.split("=")[1] ?? 0)])
  );
  const sitemap = (await getSitemapUrls()).map(toPath).filter((p) => p && !kill.has(p));
  const graph = await buildSiteGraph(
    sitemap.map((p) => SITE + p),
    { maxAgeHours: flag("--refresh-graph") ? 0 : 168 }
  );
  const pages = [];
  for (const path of sitemap) {
    const g = graph.pages[path];
    if (!g || g.status !== 200) continue;
    const file = tsxPathFor(path, ROOT);
    let kind = "manual",
      raw = null,
      prose = g.text || "";
    let title = cleanTitle(g.title),
      description = g.description || "";
    if (!file) {
      const a = db.map.get(path);
      kind = "db";
      if (a) {
        raw = a.body;
        prose = stripMarkdown(a.body);
        title = a.title;
        description = a.description;
      }
    } else if (existsSync(file)) {
      kind = "tsx";
      raw = readFileSync(file, "utf8");
      prose = tsxProse(raw).join("\n");
    }
    if (!title) title = path;
    pages.push({
      path,
      kind,
      file,
      raw,
      title,
      description,
      prose,
      links: new Set(g.links || []),
      impressions: keepImpr[path] ?? 0,
      tokens: tokens(`${title} ${description} ${prose.slice(0, 4000)}`),
      titleTokens: tokens(`${title} ${description}`),
    });
  }
  return pages;
}

// --- 1 + 6. Search Console --------------------------------------------------
async function loadGsc(pages) {
  const rows = flag("--no-gsc") ? null : await gscPageQueryRows();
  const byPath = Object.fromEntries(pages.map((p) => [p.path, p]));
  const page2 = {};
  if (!rows) return { source: "prune-manifest", page2 };
  const agg = {};
  for (const r of rows) {
    if (!byPath[r.path]) continue;
    const a = (agg[r.path] ??= { impressions: 0, clicks: 0, posW: 0 });
    a.impressions += r.impressions;
    a.clicks += r.clicks;
    a.posW += r.position * r.impressions;
    const [lo, hi] = T.PAGE2_POSITION;
    if (r.position >= lo && r.position <= hi && r.impressions >= T.PAGE2_MIN_IMPRESSIONS) {
      (page2[r.path] ??= []).push({ query: r.query, impressions: r.impressions, position: r.position });
    }
  }
  for (const [path, a] of Object.entries(agg)) {
    byPath[path].impressions = a.impressions;
    byPath[path].gsc = { impressions: a.impressions, clicks: a.clicks, position: a.impressions ? +(a.posW / a.impressions).toFixed(1) : null };
  }
  for (const q of Object.values(page2)) q.sort((x, y) => y.impressions - x.impressions).splice(3);
  return { source: "gsc-api", page2 };
}

// --- 2 + 3. topics and pillars ----------------------------------------------
async function judgeTopics(pages) {
  await pMap(
    chunk(pages, 6),
    async (batch) => {
      const state = { pages: batch.map((p) => ({ title: p.title, description: p.description, excerpt: excerpt(p.prose, 600) })) };
      const questions = {};
      batch.forEach((_, i) => {
        questions[`topic_${i}`] = choice(
          `Which topic group does \`pages[${i}]\` belong to, judged by the question its reader wants answered and what they want to do next?`,
          TOPICS
        );
        questions[`pillar_${i}`] = noul(`Is \`pages[${i}]\` a broad overview guide for its whole topic, the kind of page that would link out to narrower articles?`, {
          true: "Explains the broad subject end to end and would naturally point readers to detailed sub-articles",
          false: "Answers one narrow question, task, or a company/role-specific scenario",
        });
      });
      const ans = await systemOne(state, questions);
      batch.forEach((p, i) => {
        p.topic = HUB_PATHS.has(p.path) ? "none" : ans[`topic_${i}`].choice;
        p.topicConf = ans[`topic_${i}`].confidence;
        p.pillarProb = ans[`pillar_${i}`].noul;
      });
    },
    4
  );
  const topics = {};
  for (const p of pages) if (p.topic !== "none") (topics[p.topic] ??= { pages: [], pillar: null }).pages.push(p.path);
  const byPath = Object.fromEntries(pages.map((p) => [p.path, p]));
  // Hack 3 — the independent "overview?" noul only shortlists (every
  // "ultimate guide" article says yes to it). The pillar itself is a
  // comparative judgment, so it is one Choice per topic over the shortlist.
  // Static src/app pages are the curated guides; /learn/pm articles are the
  // frozen programmatic inventory (clusters.json) and only serve as fallback.
  await pMap(
    Object.entries(topics),
    async ([id, t]) => {
      // No floor on the shortlist: hub pages whose prose is UI copy score low
      // on the independent noul yet win the comparison. The floor applies to
      // the Choice winner instead (below).
      const scored = t.pages
        .map((path) => byPath[path])
        .sort((a, b) => b.pillarProb * (1 + Math.log1p(b.impressions)) - a.pillarProb * (1 + Math.log1p(a.impressions)));
      const statics = scored.filter((p) => p.kind === "tsx");
      const cands = (statics.length ? statics : scored).slice(0, 8);
      if (!cands.length) return;
      if (cands.length === 1) {
        if (cands[0].pillarProb >= T.LINK_MIN_PILLAR_PROB) t.pillar = cands[0].path;
        t.pillarConf = cands[0].pillarProb;
        return;
      }
      const state = { topic: { id, description: TOPICS[id] }, candidates: cands.map((p) => ({ title: p.title, description: p.description })) };
      const ans = await systemOne(state, {
        pillar: choice(
          "Which candidate should be the pillar page for `topic` — the main guide a reader starts from, which explains the broad subject and can link out to the narrower candidates?",
          Object.fromEntries(cands.map((p, i) => [`c${i}`, p.title]))
        ),
      });
      const i = Number(ans.pillar.choice.slice(1));
      const winP = ans.pillar.probabilities?.[ans.pillar.choice] ?? ans.pillar.confidence;
      t.pillar = winP >= T.LINK_MIN_PILLAR_PROB ? cands[i].path : null;
      t.pillarConf = +winP.toFixed(2);
      t.pillarProbabilities = Object.fromEntries(cands.map((p, k) => [p.path, +(ans.pillar.probabilities?.[`c${k}`] ?? 0).toFixed(2)]));
    },
    4
  );
  return topics;
}

// --- 6. page-2 destinations must actually answer the query ------------------
async function judgePage2(pages, page2) {
  const byPath = Object.fromEntries(pages.map((p) => [p.path, p]));
  const out = {};
  await pMap(
    Object.entries(page2),
    async ([path, queries]) => {
      const p = byPath[path];
      const state = { destination: { title: p.title, description: p.description, excerpt: excerpt(p.prose, 900) }, queries: queries.map((q) => q.query) };
      const questions = {};
      queries.forEach((_, i) => {
        questions[`answers_${i}`] = noul(`Does \`destination\` answer the search query \`queries[${i}]\`?`, {
          true: "A searcher typing this query would find their answer on this page",
          false: "The page is on a related topic but does not answer this query",
        });
      });
      const ans = await systemOne(state, questions);
      const ok = queries.map((q, i) => ({ ...q, answers: ans[`answers_${i}`].noul })).filter((q) => q.answers >= T.PAGE2_MIN_ANSWERS_QUERY);
      if (ok.length) out[path] = ok[0];
    },
    4
  );
  return out;
}

// --- 5. shortlist + re-rank destinations per source -------------------------
async function judgeRelevance(sources, pages, topics, page2, ledgerPairs) {
  const pillars = new Set(Object.values(topics).map((t) => t.pillar).filter(Boolean));
  await pMap(
    sources,
    async (src) => {
      const cands = pages
        .filter(
          (d) =>
            d.path !== src.path &&
            d.topic !== "none" &&
            !src.links.has(d.path) &&
            !ledgerPairs.has(`${src.path}→${d.path}`) &&
            (d.topic === src.topic || pillars.has(d.path) || page2[d.path])
        )
        .map((d) => ({ d, fast: overlap(src.tokens, d.titleTokens) + (page2[d.path] ? 0.3 : 0) + (d.topic === src.topic && pillars.has(d.path) ? 0.15 : 0) }))
        .sort((a, b) => b.fast - a.fast)
        .slice(0, T.LINK_CANDIDATES_PER_SOURCE)
        .map((c) => c.d);
      src.accepted = [];
      if (!cands.length) return;
      const state = {
        source: { title: src.title, description: src.description, excerpt: excerpt(src.prose, 1500) },
        candidates: cands.map((d) => ({ title: d.title, description: d.description })),
      };
      const questions = {};
      cands.forEach((_, i) => {
        questions[`rel_${i}`] = noul(`Would a reader of \`source\` be helped by a link to \`candidates[${i}]\` at the point where the article touches that subject?`, {
          true: "The candidate answers a question the source raises, or is the reader's natural next step after this article",
          false: "The candidate merely shares the broad field, or repeats what the source already covers",
        });
      });
      const ans = await systemOne(state, questions);
      src.accepted = cands
        .map((d, i) => ({ d, rel: ans[`rel_${i}`].noul }))
        .filter((c) => c.rel >= T.LINK_MIN_RELEVANCE)
        .sort((a, b) => (page2[b.d.path] ? 1 : 0) - (page2[a.d.path] ? 1 : 0) || b.rel - a.rel);
    },
    4
  );
}

// --- 8. sentence + anchor selection (one request, speculative anchors) ------
async function placeLink(src, dest, usedForDest, usedSentences) {
  const destTokens = tokens(`${dest.title} ${dest.description}`);
  const sentences = splitSentences(src.prose)
    .filter((s) => !usedSentences.has(s)) // one link per sentence per page
    .map((s) => ({ s, fast: overlap(tokens(s), destTokens) }))
    .sort((a, b) => b.fast - a.fast)
    .slice(0, T.LINK_SENTENCE_CANDIDATES)
    .map((x) => x.s);
  if (!sentences.length) return { skip: "no candidate sentences" };
  const state = { destination: { title: dest.title, description: dest.description }, sentences };
  const sentenceCriteria = Object.fromEntries(sentences.map((s, i) => [`s${i}`, s]));
  sentenceCriteria.none = "No sentence discusses the task or question the destination answers";
  const questions = {
    where: choice(
      "Which sentence in `sentences` is the best place to add a link to `destination`? The sentence must already discuss the task or question the destination answers, so the link reads as the reader's next step.",
      sentenceCriteria
    ),
  };
  const spec = sentences.slice(0, 3).map((s) => anchorWindows(s, destTokens, T.LINK_ANCHOR_CANDIDATES));
  spec.forEach((windows, k) => {
    if (!windows.length) return;
    const crit = Object.fromEntries(windows.map((w) => [w, null]));
    crit.none = "No phrase in the sentence describes what the reader gets on the destination page, or every fitting phrase refers to the current page itself";
    questions[`anchor_${k}`] = choice(
      `Assume the link is placed in \`sentences[${k}]\`. Which phrase from that sentence should be the link text? It must read as a description of what the reader gets on \`destination\`, and must not refer to the page the reader is already on (phrases like "this guide" or "this complete prep guide" are not link text).`,
      crit
    );
  });
  const ans = await systemOne(state, questions);
  const w = ans.where;
  const noneP = (a) => a.probabilities?.none ?? (a.choice === "none" ? 1 : 0);
  const best = (a) => Object.entries(a.probabilities ?? { [a.choice]: 1 }).filter(([k]) => k !== "none").sort((x, y) => y[1] - x[1])[0];
  const [sKey, sentenceProb] = best(w) ?? ["none", 0];
  // Two gates: the model must not prefer "none", and one sentence must stand
  // out. Spread across several plausible sentences is a real "no clear spot".
  if (noneP(w) > T.LINK_MAX_NONE_PROB || sentenceProb < T.LINK_MIN_SENTENCE_PROB) {
    return { skip: "no fitting sentence", detail: { none: +noneP(w).toFixed(2), top: sentences[Number(sKey.slice(1))], topProb: +sentenceProb.toFixed(2) } };
  }
  const sIdx = Number(sKey.slice(1));
  const sentence = sentences[sIdx];
  let anchorAns = ans[`anchor_${sIdx}`];
  if (!anchorAns) {
    const windows = anchorWindows(sentence, destTokens, T.LINK_ANCHOR_CANDIDATES);
    if (!windows.length) return { skip: "no anchor candidates" };
    const crit = Object.fromEntries(windows.map((x) => [x, null]));
    crit.none = "No phrase in the sentence describes what the reader gets on the destination page, or every fitting phrase refers to the current page itself";
    const second = await systemOne(
      { destination: state.destination, sentence },
      {
        anchor: choice(
          'Which phrase from `sentence` should be the link text? It must read as a description of what the reader gets on `destination`, and must not refer to the page the reader is already on (phrases like "this guide" are not link text).',
          crit
        ),
      }
    );
    anchorAns = second.anchor;
  }
  // Anchor windows overlap heavily ("product discovery" / "product discovery
  // guide"…), so mass spreads across near-synonyms. That is a harmless
  // preference spread (docs: confidence) — gate on "none" instead, and let
  // the variation rule pick among the acceptable phrases.
  const picked = pickAnchor(anchorAns.probabilities ?? { [anchorAns.choice]: anchorAns.confidence }, usedForDest, T.LINK_ANCHOR_VARIATION_RATIO);
  if (noneP(anchorAns) > T.LINK_MAX_NONE_PROB || !picked || picked.prob < T.LINK_MIN_ANCHOR_PROB) {
    return { skip: "no anchor phrase fits", detail: { none: +noneP(anchorAns).toFixed(2), top: picked?.anchor, topProb: +(picked?.prob ?? 0).toFixed(2), sentence } };
  }
  // Verify the assembled link (citation-check pattern): does the phrase, read
  // in its sentence, promise what the destination actually delivers?
  const check = await systemOne(
    { link: { sentence, anchor: picked.anchor }, destination: { title: dest.title, description: dest.description, excerpt: excerpt(dest.prose ?? "", 700) } },
    {
      delivers: noul("Would a reader who clicks `link.anchor` inside `link.sentence` find what that phrase promises on `destination`?", {
        true: "The destination covers what the anchor phrase names, so the click is rewarded",
        false: "The anchor names something the destination does not cover, or reads as a pitch for the current page",
      }),
    }
  );
  if (check.delivers.noul < T.LINK_MIN_DELIVERS) {
    return { skip: "anchor promise not delivered", detail: { delivers: +check.delivers.noul.toFixed(2), anchor: picked.anchor, sentence } };
  }
  return { sentence, sentenceProb, anchor: picked.anchor, anchorProb: picked.prob, delivers: check.delivers.noul };
}

// --- apply -------------------------------------------------------------------
async function applyLinks(links, pages, db, ledger) {
  const byPath = Object.fromEntries(pages.map((p) => [p.path, p]));
  const results = [];
  for (const l of links) {
    const src = byPath[l.source];
    let r;
    if (src.kind === "tsx") {
      r = applyToTsx(readFileSync(src.file, "utf8"), l.sentence, l.anchor, l.destination);
      if (r.ok) writeFileSync(src.file, r.src);
    } else if (src.kind === "db" && db.prisma && src.raw) {
      r = applyToMarkdown(src.raw, l.sentence, l.anchor, l.destination);
      if (r.ok) {
        const slug = src.path.split("/").pop();
        await db.prisma.article.update({ where: { slug }, data: { body: r.body } });
        src.raw = r.body;
      }
    } else {
      r = { ok: false, reason: src.kind === "db" ? "DATABASE_URL not set" : "no editable source" };
    }
    results.push({ ...l, applied: r.ok, mode: r.mode, reason: r.reason });
    if (r.ok) {
      ledger.push({
        appliedAt: new Date().toISOString(),
        source: l.source,
        destination: l.destination,
        anchor: l.anchor,
        sentence: l.sentence,
        kind: l.kind,
        query: l.query ?? null,
        baseline: byPath[l.destination]?.gsc ?? null,
      });
    }
  }
  writeFileSync(FILES.LINKS_LEDGER, JSON.stringify(ledger, null, 2) + "\n");
  return results;
}

function planMarkdown(plan) {
  const bySource = {};
  for (const l of plan.links) (bySource[l.source] ??= []).push(l);
  const lines = [
    `# Internal links working list — ${plan.generatedAt}`,
    "",
    `Universe ${plan.universe} pages (sitemap − prune kill list) · GSC source: ${plan.gscSource} · ${plan.links.length} proposed links · ${plan.skipped.length} skipped`,
    "",
    "## Pillars (hack 3) → footer guides column (hack 7)",
    ...Object.entries(plan.topics).map(([id, t]) => `- **${id}** (${t.pages.length} pages): ${t.pillar ?? "_no page clears the pillar floor_"}`),
    "",
    "## Page-2 destinations (hack 6)",
    ...Object.entries(plan.page2).map(([p, q]) => `- ${p} ← "${q.query}" pos ${q.position}, ${q.impressions} impr (answers p=${q.answers.toFixed(2)})`),
    "",
    "## Links by source page",
  ];
  for (const [src, ls] of Object.entries(bySource)) {
    lines.push("", `### ${src}`);
    for (const l of ls) {
      lines.push(`- → ${l.destination} [${l.kind}] anchor **${l.anchor}** (rel ${l.relevance.toFixed(2)}, sent ${l.sentenceProb.toFixed(2)}, anchor ${l.anchorProb.toFixed(2)})`);
      lines.push(`  > ${l.sentence.replace(l.anchor, `[${l.anchor}](${l.destination})`)}`);
    }
  }
  return lines.join("\n") + "\n";
}

async function main() {
  if (!process.env.TYPESAFE_API_KEY) throw new Error("TYPESAFE_API_KEY not set");
  const db = await loadDbArticles();
  const ledger = readJson(FILES.LINKS_LEDGER, []);
  const ledgerPairs = new Set(ledger.map((l) => `${l.source}→${l.destination}`));
  const usedAnchors = {};
  for (const l of ledger) (usedAnchors[l.destination] ??= new Set()).add(l.anchor);

  const pages = await loadPages(db);
  console.log(`pages: ${pages.length} (${pages.filter((p) => p.kind === "tsx").length} tsx, ${pages.filter((p) => p.kind === "db").length} db)`);
  const gsc = await loadGsc(pages);
  const topics = await judgeTopics(pages);
  console.log(`topics: ${Object.keys(topics).length}, pillars: ${Object.values(topics).filter((t) => t.pillar).length}`);
  const page2 = await judgePage2(pages, gsc.page2);
  console.log(`page-2 destinations: ${Object.keys(page2).length} (gsc: ${gsc.source})`);

  let sources = pages.filter((p) => p.topic !== "none" && p.prose && (p.kind === "tsx" || (p.kind === "db" && p.raw)));
  const limit = Number(opt("--limit", 0));
  if (limit) sources = sources.slice(0, limit);
  await judgeRelevance(sources, pages, topics, page2, ledgerPairs);

  const links = [];
  const skipped = [];
  const destCount = {};
  const pillars = new Set(Object.values(topics).map((t) => t.pillar).filter(Boolean));
  for (const src of sources) {
    let added = 0;
    const usedSentences = new Set();
    const targets = [...src.accepted];
    const hasMoney = MONEY_PAGES.some((m) => src.links.has(m.path));
    if (!hasMoney && !ledgerPairs.has(`${src.path}→${MONEY_PAGES[0].path}`)) targets.push({ d: MONEY_PAGES[0], rel: 1, money: true });
    for (const { d, rel, money } of targets) {
      if (added >= T.LINK_MAX_NEW_PER_SOURCE) break;
      if ((destCount[d.path] ?? 0) >= T.LINK_MAX_NEW_PER_DEST) continue;
      const used = (usedAnchors[d.path] ??= new Set());
      const r = await placeLink(src, d, used, usedSentences);
      if (r.skip) {
        skipped.push({ source: src.path, destination: d.path, reason: r.skip, ...(r.detail ? { detail: r.detail } : {}) });
        continue;
      }
      links.push({
        source: src.path,
        destination: d.path,
        kind: money ? "money" : page2[d.path] ? "page2" : pillars.has(d.path) ? "pillar" : "support",
        query: page2[d.path]?.query,
        relevance: rel,
        sentence: r.sentence,
        sentenceProb: r.sentenceProb,
        anchor: r.anchor,
        anchorProb: r.anchorProb,
        delivers: r.delivers,
        apply: src.kind,
      });
      used.add(r.anchor);
      usedSentences.add(r.sentence);
      destCount[d.path] = (destCount[d.path] ?? 0) + 1;
      added++;
    }
  }
  flushJevCache();

  const byPath = Object.fromEntries(pages.map((p) => [p.path, p]));
  const plan = {
    generatedAt: new Date().toISOString(),
    universe: pages.length,
    gscSource: gsc.source,
    // Per-page judgments — the review surface for thresholds and pillar picks.
    pages: Object.fromEntries(
      pages.map((p) => [p.path, { kind: p.kind, topic: p.topic, topicConf: +p.topicConf.toFixed(2), pillarProb: +p.pillarProb.toFixed(2), impressions: p.impressions, gsc: p.gsc ?? null }])
    ),
    topics: Object.fromEntries(Object.entries(topics).map(([id, t]) => [id, { ...t, pillarTitle: t.pillar ? byPath[t.pillar].title : null }])),
    page2,
    footer: {
      guides: Object.entries(topics)
        .filter(([, t]) => t.pillar)
        .map(([topic, t]) => ({ topic, path: t.pillar, title: byPath[t.pillar].title })),
      money: MONEY_PAGES.map((m) => m.path),
    },
    links,
    skipped,
    usage: { ...usage },
  };
  writeFileSync(FILES.LINKS_PLAN, JSON.stringify(plan, null, 2) + "\n");
  writeFileSync(join(ROOT, "seo-drafts", "internal-links-plan.md"), planMarkdown(plan));
  console.log(`plan: ${links.length} links, ${skipped.length} skipped → ${FILES.LINKS_PLAN}`);
  console.log(`jev: ${usage.requests} requests (${usage.cached} cached), ${usage.input_tokens} in / ${usage.output_tokens} out tokens`);

  if (flag("--apply")) {
    const results = await applyLinks(links, pages, db, ledger);
    const ok = results.filter((r) => r.applied);
    console.log(`applied: ${ok.length}/${results.length}`);
    for (const r of results.filter((x) => !x.applied)) console.log(`  skip ${r.source} → ${r.destination}: ${r.reason}`);
    plan.applied = results;
    writeFileSync(FILES.LINKS_PLAN, JSON.stringify(plan, null, 2) + "\n");
  }
  if (db.prisma) await db.prisma.$disconnect();
}

main().catch((e) => {
  flushJevCache();
  console.error(e);
  process.exit(1);
});
