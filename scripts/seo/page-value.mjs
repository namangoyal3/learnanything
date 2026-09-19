/**
 * scripts/seo/page-value.mjs — per-page "standalone value" judgments for the
 * prune keep-set (v2 §5). Jev scores each page once; code owns the cut.
 *
 * Why: the manifest's merit passes key on GSC evidence, which 84% of the
 * 1,393 sitemap URLs have none of (222 pages with ≥1 impression / 90d as of
 * 2026-09-20). The budget fill then rescued by cosine-group size — a proxy
 * for topic popularity, not page quality — and drifted off-target (450 keeps).
 * A calibrated value score + a thin/templated check let the fill rank the
 * zero-evidence pages by what a reader would lose, and drop the templated ones.
 *
 * Answers are cached in scripts/seo/jev-cache.json, so re-cuts are free.
 */
import { systemOne, score, noul, pMap } from "./jev.mjs";

const EXCERPT = 1400;
const BATCH = 8;
const SITE = "learnanything.pro — a PM interview-prep and PM career site; readers are product managers and PM job-seekers, mostly in India";

// Levels are concrete situations; position 0-4. Cut points live in config.mjs.
export const VALUE_LEVELS = [
  "Filler: restates the title in generic sentences; nothing a reader could act on or quote",
  "Shallow: a correct overview any search result gives; no specific numbers, named examples, real questions, or steps",
  "Usable: at least one specific element (concrete numbers, a framework applied to a real case, real interview questions, a step-by-step) — a typical blog post",
  "Substantial: a complete, specific answer the reader can act on today (e.g. salary bands by level and company, interview questions with worked answers, a full template)",
  "Reference: depth and specificity beyond a typical search result — the reader would bookmark or cite it",
];

const page = (p) => ({ path: p.path, title: p.title || "", excerpt: String(p.text || "").slice(0, EXCERPT) });

/**
 * pages: [{ path, title, text }] → [{ value: position 0-4, thin: P(yes) }]
 * in the same order. BATCH pages per request; every question is independent.
 */
export async function pageValues(pages, { batch = BATCH, concurrency = 4 } = {}) {
  const out = new Array(pages.length);
  const chunks = [];
  for (let i = 0; i < pages.length; i += batch) chunks.push(pages.slice(i, i + batch).map((p, j) => ({ p, idx: i + j })));
  await pMap(
    chunks,
    async (chunk) => {
      const state = { site: SITE, pages: chunk.map(({ p }) => page(p)) };
      const questions = {};
      chunk.forEach((_, k) => {
        questions[`value_${k}`] = score(
          `For a reader who searched for the topic in \`pages[${k}].title\`, how much would they lose if \`pages[${k}]\` disappeared from the web? Judge the excerpt on specificity and completeness, not length or polish.`,
          VALUE_LEVELS
        );
        questions[`thin_${k}`] = noul(
          `Is \`pages[${k}]\` a templated page: the body is generic PM advice that would read the same with a different company, role, or topic swapped into the title, rather than content specific to the title's promise?`,
          { true: "Swap the title's subject and the body still fits; company/topic appears only in the title, headings, or boilerplate", false: "The body carries facts, examples, questions, or numbers that only make sense for this exact title" }
        );
      });
      const ans = await systemOne(state, questions);
      chunk.forEach(({ idx }, k) => {
        out[idx] = { value: ans[`value_${k}`].score, valueConfidence: ans[`value_${k}`].confidence, thin: ans[`thin_${k}`].noul };
      });
    },
    concurrency
  );
  return out;
}
