/**
 * scripts/seo/internal-links-lib.mjs — pure helpers for the internal-linking
 * playbook (no network, no fs). The orchestrator (internal-links.mjs) asks
 * Jev the semantic questions; everything here is deterministic code:
 * taxonomy, sentence/anchor candidates, fast-search overlap, and the two
 * edit appliers (markdown article body, static page TSX).
 *
 * Design rule from the TypeSafe skill: select, never generate. Code proposes
 * the candidates (sentences, phrases); Jev only picks among them; code copies
 * the picked span verbatim into the source.
 */

// Hack 2 — topic groups by the reader's question, not the URL. `none` covers
// product/legal/hub pages that should never be a contextual destination.
export const TOPICS = {
  "interview-prep": "PM interview rounds, question types, case/product-sense/metrics/behavioral rounds, company-specific interview prep",
  "career-entry": "Becoming a PM: transitioning from another role, APM programs, first PM job, resume, portfolio with no experience",
  "career-growth": "Progressing as a PM: career path, levels, senior PM, promotions, mentorship, reading lists",
  "salary-offers": "PM salary, compensation, negotiation, comparing multiple offers",
  "discovery-research": "Product discovery, customer interviews, user research, product-market fit, continuous discovery",
  "strategy-planning": "Product strategy, vision, roadmaps, prioritization, quarterly planning, OKRs",
  "execution-delivery": "PRDs, sprint planning, product reviews, launches, betas, working with engineering/design/data",
  "metrics-experiments": "Product metrics, KPIs, analytics, A/B testing and experimentation",
  "pm-craft": "Core PM skills: communication, writing, storytelling, decision making, mental models, intellectual honesty",
  "ai-product": "AI/LLM product management, AI product strategy, building with models",
  "domain-guides": "Domain-specific PM guides: fintech, e-commerce, consumer, B2B, localization, India market specifics",
  "tools-templates": "PM tools, templates, cheat sheets, checklists",
  none: "Not an educational PM page: product, pricing, signup, legal, account, or a listing/hub page",
};

// Listing/product/legal routes are never contextual destinations, whatever
// Jev makes of their marketing copy. Code rule, no judgment needed.
export const HUB_PATHS = new Set(["/", "/learn", "/explore", "/pricing", "/signup", "/login", "/research", "/privacy", "/terms", "/about"]);

// Hack 4 — money pages are known in code; Jev only judges where they fit.
export const MONEY_PAGES = [
  {
    path: "/signup",
    title: "PM Streak — free daily PM practice",
    description:
      "Start daily 2-minute PM lessons and practice questions (free account). The product that builds the product instinct the guides describe.",
  },
  {
    path: "/pricing",
    title: "PM Streak plans and pricing",
    description: "Compare the free plan with paid plans that unlock the full lesson catalog, interview drills and learning plans.",
  },
];

const STOPWORDS = new Set(
  "a an the and or but of to in on at for with by from as is are was were be been being it its this that these those you your we our they their he she his her them us i my me not no yes so if then than too very can will would should could may might must do does did done have has had having also into over under about after before between through during without within up down out off just only more most less least many much any some such own same other another each every all both few several one two three four five six seven eight nine ten how what which who whom whose when where why here there because while although though since until unless whether however therefore thus via per like get got make made".split(
    " "
  )
);

const ENTITY_RE = /&(amp|lt|gt|quot|apos|nbsp|#39|#x27|#x2019|#8217);/g;
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", "#39": "'", "#x27": "'", "#x2019": "’", "#8217": "’" };

export function normalizeText(s) {
  return String(s ?? "")
    .replace(ENTITY_RE, (_, e) => ENTITIES[e] ?? " ")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export function tokens(s) {
  return new Set(
    normalizeText(s)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w))
  );
}

/** Fast search (rerank cookbook step 1): share of `query` tokens present in `doc`. */
export function overlap(docTokens, queryTokens) {
  if (!queryTokens.size) return 0;
  let hit = 0;
  for (const t of queryTokens) if (docTokens.has(t)) hit++;
  return hit / queryTokens.size;
}

export function excerpt(text, n = 1200) {
  const t = normalizeText(text);
  return t.length <= n ? t : t.slice(0, n).replace(/\s\S*$/, "") + "…";
}

/** Markdown → readable text (headings, emphasis, links, list markers dropped). */
export function stripMarkdown(md) {
  return String(md ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/[*_`>]/g, "");
}

/**
 * Prose a static page renders: long string literals + JSX text nodes.
 * Skips what applyToTsx would refuse anyway (metadata, JSON-LD, FAQ fields),
 * so those sentences never cost a judgment.
 */
export function tsxProse(src) {
  const body = src.replace(/export const metadata[\s\S]*?\n};\n/, "\n").replace(/<JsonLd[\s\S]*?\/>/g, " ");
  const out = [];
  for (const m of body.matchAll(/"((?:[^"\\\n]|\\.){40,})"/g)) {
    const before = body.slice(Math.max(0, m.index - 12), m.index);
    if (/\b(q|a|question|answer|name|text)\s*:\s*$/.test(before)) continue;
    out.push(m[1].replace(/\\"/g, '"'));
  }
  for (const m of body.matchAll(/>([^<>{}]{40,})</g)) out.push(m[1]);
  return out.map(normalizeText).filter((t) => /[.!?]/.test(t));
}

/**
 * Candidate sentences: full sentences of 8–45 words with real prose in them.
 * Bullets/arrows and shouty heading-like fragments are dropped.
 */
// Brand / call-to-action copy is the page's conversion surface — never a
// place to send the reader somewhere else. Known strings, so a code rule.
const CTA_RE = /PM Streak|AI feedback|daily (?:PM )?(?:scenarios|practice|lessons|prep)|2-min(?:ute)?|per session|Start (?:your|daily|free)|— Free|Sign up/i;

export function splitSentences(text) {
  // Pieces arrive newline-separated (tsxProse) or as paragraphs (markdown);
  // a fragment without terminal punctuation must not glue onto its neighbour.
  const parts = String(text ?? "")
    .split(/\n+/)
    .flatMap((piece) => normalizeText(piece).match(/[^.!?]+[.!?]+(?=\s|$)/g) || []);
  const seen = new Set();
  const out = [];
  for (const raw of parts) {
    const s = raw.trim();
    const words = s.split(/\s+/);
    if (words.length < 8 || words.length > 45) continue;
    if (s.endsWith("?")) continue; // FAQ / rhetorical questions are not link spots
    if (CTA_RE.test(s)) continue;
    if (!/[a-z]/.test(s) || /[→|•[\]{}<>]/.test(s)) continue;
    const caps = words.filter((w) => /^[A-Z]/.test(w)).length;
    if (caps > words.length * 0.6) continue;
    if (seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

/**
 * Anchor candidates: 2–5-word windows that don't start/end on a stopword or
 * punctuation. Ranked by overlap with the destination so the shortlist Jev
 * sees is small but never omits the obvious phrase.
 */
export function anchorWindows(sentence, destTokens, max = 24) {
  // Windows never cross punctuation: "visibility, impact" is not link text,
  // and the applier could not find it verbatim anyway.
  const clauses = normalizeText(sentence)
    .split(/[.!?,;:"()—–]|\s-\s/)
    .map((c) => c.split(/\s+/).filter(Boolean))
    .filter((c) => c.length >= 2);
  const cands = new Map();
  for (const words of clauses) for (let len = 2; len <= 5; len++) {
    for (let i = 0; i + len <= words.length; i++) {
      const win = words.slice(i, i + len);
      const first = win[0].toLowerCase();
      const last = win[len - 1].toLowerCase();
      if (STOPWORDS.has(first) || STOPWORDS.has(last)) continue;
      if (win.some((w) => /^\d+%?$/.test(w))) continue;
      const phrase = win.join(" ");
      // Same overlap → the tighter phrase leads (fewer filler words in the anchor).
      if (!cands.has(phrase)) cands.set(phrase, overlap(tokens(phrase), destTokens) - len * 0.01);
    }
  }
  return [...cands.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([p]) => p);
}

/**
 * Hack 8 — vary link text. Given a choice distribution over anchor phrases,
 * prefer an unused phrase for this destination when its probability is
 * within `ratio` of the top one. Never returns `none`.
 */
export function pickAnchor(probabilities, usedForDest, ratio) {
  const ranked = Object.entries(probabilities)
    .filter(([k]) => k !== "none")
    .sort((a, b) => b[1] - a[1]);
  if (!ranked.length) return null;
  const [top, topP] = ranked[0];
  if (!usedForDest.has(top)) return { anchor: top, prob: topP };
  const alt = ranked.find(([k, p]) => !usedForDest.has(k) && p >= topP * ratio);
  return alt ? { anchor: alt[0], prob: alt[1] } : { anchor: top, prob: topP };
}

// ---------------------------------------------------------------------------
// Applying an edit: find the exact sentence in the source, then the anchor
// phrase inside it. Matching is tolerant to whitespace, entities and curly
// quotes because the candidate came from rendered/normalized text.

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function tolerantRegex(text, { sep = "\\s+", flags = "" } = {}) {
  const parts = normalizeText(text)
    .split(" ")
    .map((w) =>
      escapeRe(w)
        .replace(/'/g, "(?:'|’|&apos;|&#x27;|&#39;|&#8217;)")
        .replace(/"/g, '(?:"|“|”|&quot;)')
        .replace(/&(?!(?:apos|#x27|#39|#8217|quot);)/g, "(?:&|&amp;)")
    );
  return new RegExp(parts.join(sep), flags);
}

/** First span of `needle` in `hay`; null if absent or ambiguous (2+ hits). */
export function findSpan(hay, needle, opts) {
  const re = tolerantRegex(needle, { ...opts, flags: "g" });
  const first = re.exec(hay);
  if (!first) return null;
  if (re.exec(hay)) return { ambiguous: true };
  return { start: first.index, end: first.index + first[0].length, text: first[0] };
}

const MARKUP_RE = /[*_`[\]()<>]/;

/** Markdown article body: `anchor` inside `sentence` → `[anchor](dest)`. */
export function applyToMarkdown(body, sentence, anchor, dest) {
  const span = findSpan(body, sentence, { sep: "(?:\\s|\\*|_|`)+" });
  if (!span) return { ok: false, reason: "sentence not found" };
  if (span.ambiguous) return { ok: false, reason: "sentence ambiguous" };
  if (/\]\(|<a\s/i.test(span.text)) return { ok: false, reason: "sentence already links" };
  const a = findSpan(span.text, anchor, { sep: "(?:\\s|\\*|_|`)+" });
  if (!a || a.ambiguous) return { ok: false, reason: "anchor not found in sentence" };
  if (MARKUP_RE.test(a.text)) return { ok: false, reason: "anchor spans markup" };
  const edited = span.text.slice(0, a.start) + `[${a.text}](${dest})` + span.text.slice(a.end);
  return { ok: true, body: body.slice(0, span.start) + edited + body.slice(span.end) };
}

// FAQ fields are mirrored into JSON-LD by faqSchema(); never put markup there.
const SCHEMA_FIELDS = new Set(["q", "a", "question", "answer", "name", "text"]);

function insideBlock(src, at, open, close) {
  const o = src.lastIndexOf(open, at);
  if (o === -1) return false;
  const c = src.indexOf(close, o);
  return c === -1 || c > at;
}

function ensureImport(src, line, marker) {
  if (src.includes(marker)) return src;
  const m = src.match(/^import[^\n]*\n(?:import[^\n]*\n)*/m);
  return m ? src.slice(0, m.index + m[0].length) + line + "\n" + src.slice(m.index + m[0].length) : line + "\n" + src;
}

/**
 * Static page TSX. Two shapes exist in src/app/<slug>/page.tsx:
 *  - JSX text node  → wrap anchor in <Link href={dest}>…</Link>
 *  - string literal in a const array rendered as {x.field} → write
 *    `[anchor](dest)` into the literal and wrap every {x.field} render in
 *    linkify() (src/components/Linkify.tsx). Literals inside `metadata`,
 *    JSON-LD or FAQ fields are refused: schema text must stay plain.
 */
export function applyToTsx(src, sentence, anchor, dest) {
  const span = findSpan(src, sentence);
  if (!span) return { ok: false, reason: "sentence not found" };
  if (span.ambiguous) return { ok: false, reason: "sentence ambiguous" };
  if (/<Link|\]\(|<a\s/.test(span.text)) return { ok: false, reason: "sentence already links" };
  const a = findSpan(span.text, anchor);
  if (!a || a.ambiguous) return { ok: false, reason: "anchor not found in sentence" };
  if (MARKUP_RE.test(a.text.replace(/&#x27;|&apos;|&#39;/g, ""))) return { ok: false, reason: "anchor spans markup" };
  if (insideBlock(src, span.start, "export const metadata", "\n};")) return { ok: false, reason: "inside metadata" };
  if (insideBlock(src, span.start, "<JsonLd", "/>")) return { ok: false, reason: "inside JSON-LD" };

  const lineStart = src.lastIndexOf("\n", span.start) + 1;
  const prefix = src.slice(lineStart, span.start);
  const quotesBefore = (prefix.match(/(?<!\\)"/g) || []).length;
  const absStart = span.start + a.start;
  const absEnd = span.start + a.end;

  if (quotesBefore % 2 === 0) {
    // JSX text node — must sit directly inside an element, not an attribute.
    if (!/^\s*$/.test(prefix) && !/>[^<>"]*$/.test(prefix)) return { ok: false, reason: "not a JSX text node" };
    const out = src.slice(0, absStart) + `<Link href="${dest}">${a.text}</Link>` + src.slice(absEnd);
    return { ok: true, mode: "jsx", src: ensureImport(out, 'import Link from "next/link";', 'from "next/link"') };
  }

  // String literal — which object field is it?
  let field = prefix.match(/(\w+)\s*:\s*"[^"]*$/)?.[1];
  if (!field && /^\s*"/.test(prefix)) {
    const prevLine = src.slice(src.lastIndexOf("\n", lineStart - 2) + 1, lineStart - 1);
    field = prevLine.match(/(\w+)\s*:\s*$/)?.[1];
  }
  if (!field) return { ok: false, reason: "literal field unknown" };
  if (SCHEMA_FIELDS.has(field)) return { ok: false, reason: `field ${field} feeds schema` };
  const renderRe = new RegExp(`\\{\\s*(\\w+)\\.${field}\\s*\\}`, "g");
  if (!renderRe.test(src)) return { ok: false, reason: `no {x.${field}} render site` };
  let out = src.slice(0, absStart) + `[${a.text}](${dest})` + src.slice(absEnd);
  out = out.replace(renderRe, `{linkify($1.${field})}`);
  out = ensureImport(out, 'import { linkify } from "@/components/Linkify";', "@/components/Linkify");
  return { ok: true, mode: "literal", field, src: out };
}

/** Path → static page file, or null for DB articles / unknown routes. */
export function tsxPathFor(path, root) {
  if (path.startsWith("/learn/") && path.split("/").length === 4) return null; // /learn/<vertical>/<slug> = DB Article
  return `${root}/src/app${path === "/" ? "" : path}/page.tsx`;
}
