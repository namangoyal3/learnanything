/**
 * scripts/seo/same-intent.mjs — "do these two pages answer the same reader
 * question?" as a Jev Noul, the re-ranking step behind the §1b dedupe gate
 * and the prune's dup-of-kept decision.
 *
 * Why: both decisions ran on embedding cosine ≥ COSINE_REJECT, and the
 * embeddings fell back to hash-tfidf when Ollama was down (prune manifest
 * says `provider: hash-tfidf-v1`). Cosine stays as the fast shortlist; the
 * judgment that kills or rejects a page is now a calibrated probability.
 *
 * Degrades cleanly: without TYPESAFE_API_KEY, callers keep the cosine rule.
 */
import { systemOne, noul, pMap } from "./jev.mjs";

const EXCERPT = 900;
const BATCH = 5;

export const isJevConfigured = () => Boolean(process.env.TYPESAFE_API_KEY);

const page = (p) => ({ title: p.title || p.path || "", excerpt: String(p.text || "").slice(0, EXCERPT) });

/**
 * pairs: [{ a: {title?, path?, text}, b: {...} }] → number[] (P same intent),
 * same order. Batches BATCH pairs per request; all questions are independent.
 */
export async function sameIntent(pairs, { batch = BATCH, concurrency = 4 } = {}) {
  const out = new Array(pairs.length);
  const chunks = [];
  for (let i = 0; i < pairs.length; i += batch) chunks.push(pairs.slice(i, i + batch).map((p, j) => ({ ...p, idx: i + j })));
  await pMap(
    chunks,
    async (chunk) => {
      const state = { pairs: chunk.map((p) => ({ a: page(p.a), b: page(p.b) })) };
      const questions = {};
      chunk.forEach((_, k) => {
        questions[`same_${k}`] = noul(
          `Do \`pairs[${k}].a\` and \`pairs[${k}].b\` answer the same reader question, so that a searcher would need only one of them?`,
          {
            true: "Same question and same kind of answer; the second page adds nothing a reader of the first would need",
            false: "Different question, different audience, or a materially different angle (e.g. a template vs. a guide, one company vs. general)",
          }
        );
      });
      const ans = await systemOne(state, questions);
      chunk.forEach((p, k) => {
        out[p.idx] = ans[`same_${k}`].noul;
      });
    },
    concurrency
  );
  return out;
}
