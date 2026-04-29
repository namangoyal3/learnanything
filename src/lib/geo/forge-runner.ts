// Forge generation with HARD length enforcement and auto-expand retry.
//
// Why: a single LLM call cannot be relied on to hit a strict word floor.
// We treat Forge's spec as the contract; if the body comes back short,
// we keep its existing output and ask it to EXPAND the thinnest H2
// sections in-place, in additional passes, until the floor is met or
// the retry budget is exhausted.

import { callAgent, Agents } from "@/lib/lyzr";

export type PageType = "pillar" | "comparison" | "use-case" | "glossary";

export const FLOORS: Record<PageType, number> = {
  pillar: 1200,
  comparison: 1000,
  "use-case": 800,
  glossary: 600,
};

export type ForgeAssignment = {
  cluster: string;
  page_type: PageType;
  title: string;
  target_queries: string[];
  geo_target: number;
};

export type ForgeOutput = {
  mdx: string;
  schema_meta: unknown;
  body_word_count: number;
  passes: number;
  floor: number;
};

function extractMdx(text: string): string | null {
  // Match ```mdx (with optional whitespace/newline before content).
  // Forge sometimes emits ```mdx![...  with no newline — \s* handles both.
  const fence = text.match(/```(?:mdx|md|markdown)\s*\n?([\s\S]*?)\n```/i);
  if (fence) return fence[1];
  if (text.trimStart().startsWith("---")) return text;
  return null;
}

function extractJson(text: string): unknown | null {
  const fences = [...text.matchAll(/```(?:json|JSON)?\s*\n([\s\S]*?)\n```/g)];
  // Take the LAST json fence (after the mdx)
  const fence = fences[fences.length - 1];
  if (!fence) return null;
  try {
    return JSON.parse(fence[1]);
  } catch {
    return null;
  }
}

function bodyWordCount(mdx: string): number {
  const fmMatch = mdx.match(/^---[\s\S]*?---\s*/);
  const body = fmMatch ? mdx.slice(fmMatch[0].length) : mdx;
  const noCode = body.replace(/```[\s\S]*?```/g, "");
  return noCode.split(/\s+/).filter(Boolean).length;
}

function findThinH2(mdx: string): { heading: string; words: number } | null {
  const fmMatch = mdx.match(/^---[\s\S]*?---\s*/);
  const body = fmMatch ? mdx.slice(fmMatch[0].length) : mdx;
  const sections = body.split(/^## /m).slice(1);
  let thinnest: { heading: string; words: number } | null = null;
  for (const sec of sections) {
    const newline = sec.indexOf("\n");
    const heading = newline === -1 ? sec : sec.slice(0, newline);
    const content = newline === -1 ? "" : sec.slice(newline);
    const wc = content.split(/\s+/).filter(Boolean).length;
    if (heading.toLowerCase().includes("faq")) continue; // FAQ is its own thing
    if (!thinnest || wc < thinnest.words) {
      thinnest = { heading: heading.trim(), words: wc };
    }
  }
  return thinnest;
}

const MAX_PASSES = 6; // initial + 5 expansions

// Theme banks for adding new H2 sections per page_type, used to push past the floor.
const SECTION_THEMES: Record<PageType, string[]> = {
  pillar: [
    "Common Pitfalls and How to Avoid Them",
    "Real-World Case Studies (Figma, Spotify, Slack)",
    "Tools and Frameworks PMs Actually Use",
    "Career Paths and Skill Progression",
    "Metrics and How to Measure Success",
    "Industry Trends and Future Outlook",
  ],
  comparison: [
    "When to Pick Which: Decision Matrix",
    "Pricing and Total Cost of Ownership",
    "Migration and Switching Costs",
    "User Reviews and Field Feedback",
  ],
  "use-case": [
    "Step-by-Step Implementation",
    "Edge Cases and How to Handle Them",
    "Measuring Success in This Use Case",
  ],
  glossary: [
    "Related Terms",
    "Common Misconceptions",
    "Worked Examples",
  ],
};

export async function runForge(
  assignment: ForgeAssignment,
  sessionId: string
): Promise<ForgeOutput> {
  const floor = FLOORS[assignment.page_type];
  const initialPrompt = `Write a complete production-ready MDX page for pm-streak.

Plan item:
- cluster: ${assignment.cluster}
- page_type: ${assignment.page_type}
- title: ${assignment.title}
- target_queries: ${JSON.stringify(assignment.target_queries)}
- geo_target: ${assignment.geo_target}

Follow your agent_instructions exactly. Hit the ${assignment.page_type} word count floor of ${floor}. AIM HIGH — target ${Math.round(floor * 1.2)} words. It is much better to overshoot than to undershoot.`;

  let response = await callAgent(Agents.forge(), initialPrompt, sessionId, { timeoutMs: 300_000 });
  let mdx = extractMdx(response.response) ?? "";
  let meta = extractJson(response.response);
  let wc = mdx ? bodyWordCount(mdx) : 0;
  let passes = 1;
  const themesUsed: Set<string> = new Set();

  while (wc < floor && passes < MAX_PASSES && mdx) {
    const remainingThemes = SECTION_THEMES[assignment.page_type].filter((t) => !themesUsed.has(t));
    const themeToAdd = remainingThemes[0];
    if (!themeToAdd) break; // ran out of themes
    themesUsed.add(themeToAdd);

    const sectionPrompt = `Write ONE additional H2 section for the pm-streak page "${assignment.title}".

Section heading: ## ${themeToAdd}
Target: 350-450 words. Use 3-4 dense paragraphs.
Voice: pm-streak (Lenny-podcast-mentor tone, references real companies — Figma, Spotify, Slack, Netflix, Airbnb).
Include at least one concrete PM example and one parenthetical citation for any stat.

Return ONLY the markdown for this single section, starting with "## ${themeToAdd}". No frontmatter. No json. No prose around it. No \`\`\` fences — just raw markdown.`;

    // Fresh session per expansion — avoids inheriting the full prior conversation
    // context which confuses Forge into repeating or shortening existing sections.
    response = await callAgent(Agents.forge(), sectionPrompt, `forge-expand-${Date.now()}`, { timeoutMs: 180_000 });
    const sectionRaw = response.response.trim();
    // strip any accidental fences
    const sectionClean = sectionRaw.replace(/^```(?:md|markdown|mdx)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
    const sectionWc = sectionClean.split(/\s+/).filter(Boolean).length;
    if (sectionWc < 50) {
      passes++;
      continue; // didn't get a usable section, move on
    }

    // Splice BEFORE the FAQ section if present, else before the CTA, else at end of body.
    mdx = spliceSection(mdx, sectionClean);
    wc = bodyWordCount(mdx);
    passes++;
  }

  // Final pass: ask Forge to produce the schema/meta JSON for the assembled page.
  if (!meta || !(meta as Record<string, unknown>).schema) {
    const schemaPrompt = `Produce ONLY the schema/meta JSON block for the pm-streak page below. Output a single fenced \`\`\`json\`\`\` block with keys: schema (Article + FAQPage JSON-LD using the page's actual H1/H2/FAQ Q&A) and meta (slug="${assignment.cluster}", target_queries=${JSON.stringify(assignment.target_queries)}, geo_score_self_estimate, word_count=${wc}). No prose.

MDX page:
${mdx.slice(0, 12_000)}`;
    try {
      const r = await callAgent(Agents.forge(), schemaPrompt, `forge-schema-${Date.now()}`, { timeoutMs: 120_000 });
      const m = extractJson(r.response);
      if (m) meta = m;
    } catch {
      // ignore
    }
  }

  return { mdx, schema_meta: meta, body_word_count: wc, passes, floor };
}

function spliceSection(mdx: string, newSection: string): string {
  // Ensure section starts cleanly
  const block = `\n\n${newSection.trim()}\n`;
  // Try to insert before "## FAQ"
  const faqIdx = mdx.search(/^##\s*FAQ\b/m);
  if (faqIdx !== -1) return mdx.slice(0, faqIdx) + block + "\n" + mdx.slice(faqIdx);
  // Try before "## Call to Action" / "## CTA"
  const ctaIdx = mdx.search(/^##\s*(Call to Action|CTA)\b/m);
  if (ctaIdx !== -1) return mdx.slice(0, ctaIdx) + block + "\n" + mdx.slice(ctaIdx);
  // Otherwise append at end
  return mdx.trimEnd() + block;
}

// ---- Retrofit modes ----

export type RewriteAssignment = {
  slug: string;
  pageType: PageType;
  existingMdx: string;          // current page body
  scoutQueries: string[];       // queries this slug should rank for
  rivalGaps: string[];          // angles competitors cover that this page doesn't
  currentCitability: number;
  targetCitability: number;     // typically 80
};

/**
 * Rewrite mode: take an existing page and produce an upgraded MDX that preserves
 * URL/frontmatter, expands thin sections, and adds missing structural elements.
 * After the rewrite, falls back to the standard runForge expansion loop if the
 * result is still under the page-type word-count floor.
 */
export async function rewriteForge(
  a: RewriteAssignment,
  sessionId: string
): Promise<ForgeOutput> {
  const floor = FLOORS[a.pageType];
  const prompt = `You are rewriting an EXISTING pm-streak page in place. Preserve the slug and any frontmatter, but you may upgrade the body.

Slug: ${a.slug}
Page type: ${a.pageType}
Current citability: ${a.currentCitability}
Target citability: ${a.targetCitability}
Floor (body word count): ${floor}

Queries this page should answer (Scout):
${a.scoutQueries.map((q) => `- ${q}`).join("\n")}

Gaps competitors cover that this page does not (Rival):
${a.rivalGaps.map((g) => `- ${g}`).join("\n")}

Existing page (verbatim):
----- BEGIN -----
${a.existingMdx.slice(0, 12_000)}
----- END -----

Required upgrades:
1. Preserve any high-performing existing sections; rewrite only what's weak.
2. Add Article + FAQPage JSON-LD if missing.
3. Add a 5-Q&A FAQ section if missing.
4. Add ≥3 inline citations for any stat.
5. Reach the ${a.pageType} floor of ${floor} words.

Output STRICTLY:
\`\`\`mdx
<full upgraded MDX>
\`\`\`
\`\`\`json
{"schema":{...},"meta":{"slug":"${a.slug}","target_queries":${JSON.stringify(a.scoutQueries)},"geo_score_self_estimate":0,"word_count":0}}
\`\`\``;

  const r = await callAgent(Agents.forge(), prompt, sessionId, { timeoutMs: 300_000 });
  let mdx = extractMdx(r.response) ?? a.existingMdx;
  let meta = extractJson(r.response);
  let wc = mdx ? bodyWordCount(mdx) : 0;
  let passes = 1;

  // If still short, hand off to the standard append-only expansion loop.
  if (wc < floor) {
    const expanded = await runForge(
      {
        cluster: a.slug,
        page_type: a.pageType,
        title: a.slug.replace(/-/g, " "),
        target_queries: a.scoutQueries,
        geo_target: a.targetCitability,
      },
      `${sessionId}-expand`
    );
    if (expanded.body_word_count > wc) {
      mdx = expanded.mdx;
      meta = expanded.schema_meta;
      wc = expanded.body_word_count;
      passes += expanded.passes;
    }
  }

  return { mdx, schema_meta: meta, body_word_count: wc, passes, floor };
}

export type AppendFaqAssignment = {
  slug: string;
  existingMdx: string;
  topic: string; // e.g. the page title or primary buyer-question
};

/**
 * Cheap uplift: ask Forge for a 5-Q&A FAQ section only, and splice it in
 * before any CTA. Used by the Retrofit pipeline when a long page has no FAQ.
 */
export async function appendFaqOnly(
  a: AppendFaqAssignment,
  sessionId: string
): Promise<{ mdx: string; appended: boolean; words_added: number }> {
  // Don't double-add if FAQ already present.
  if (/^##\s*(FAQ|Frequently Asked Questions)/im.test(a.existingMdx)) {
    return { mdx: a.existingMdx, appended: false, words_added: 0 };
  }
  const prompt = `Write ONE FAQ section for the pm-streak page about "${a.topic}".
Return raw markdown only. No fences. Start with "## FAQ".
Include 5 questions actual PMs would search for, each answered in 35-60 words with concrete examples.
After the 5 Q&A, output nothing. No preamble, no CTA.`;
  const r = await callAgent(Agents.forge(), prompt, sessionId, { timeoutMs: 120_000 });
  const sectionRaw = r.response.trim();
  const sectionClean = sectionRaw
    .replace(/^```(?:md|markdown|mdx)?\s*\n?/i, "")
    .replace(/\n?```\s*$/i, "")
    .trim();
  if (!/^##\s*(FAQ|Frequently Asked Questions)/i.test(sectionClean)) {
    return { mdx: a.existingMdx, appended: false, words_added: 0 };
  }
  const before = a.existingMdx.split(/\s+/).filter(Boolean).length;
  const newMdx = spliceSection(a.existingMdx, sectionClean);
  const after = newMdx.split(/\s+/).filter(Boolean).length;
  return { mdx: newMdx, appended: true, words_added: after - before };
}
