/**
 * markdown-faq.ts — Extract structured FAQ and HowTo data from markdown article bodies.
 *
 * These functions parse the `## FAQ` section written by the Forge/Retrofit agents
 * and convert them into schema.org-ready structures for JSON-LD injection.
 */

/**
 * Extract FAQ pairs from a markdown body.
 *
 * Expects an `## FAQ` section with H3 headings as questions and the
 * following paragraph(s) as answers. Also supports "**Q:** ..." / "**A:** ..."
 * patterns as a fallback.
 */
export function extractFaqPairs(body: string): { question: string; answer: string }[] {
  // Match "## FAQ" or "## Frequently Asked Questions" up to the next level-2
  // heading or true end-of-string. The terminator was previously `\s*$` which,
  // with the `m` flag, matched at the first blank line after the heading and
  // captured an EMPTY section — so FAQ JSON-LD silently came out empty for the
  // common "## FAQ\n\n### Question" formatting real articles use.
  const faqMatch = body.match(
    /^## (?:FAQ|Frequently Asked Questions)[^\n]*\n([\s\S]*?)(?=\n## |(?![\s\S]))/im,
  );
  if (!faqMatch) return [];

  const section = faqMatch[1].trim();
  const pairs: { question: string; answer: string }[] = [];
  let match: RegExpExecArray | null;

  // Strategy 1: ### Question\nAnswer paragraphs
  const h3Pattern = /^### (.+)\n([\s\S]*?)(?=\n### |\n## |(?![\s\S]))/gim;
  while ((match = h3Pattern.exec(section)) !== null) {
    const question = match[1].trim().replace(/\*\*/g, "");
    const answer = match[2].trim().replace(/\n+/g, " ").replace(/\*\*/g, "").slice(0, 600);
    if (question && answer) pairs.push({ question, answer });
  }
  if (pairs.length > 0) return pairs;

  // Strategy 2: **Bold question?**\nAnswer paragraph (question on its own line)
  const boldQPattern = /^\*\*(.+?)\*\*\n([\s\S]*?)(?=\n\*\*|\n### |\n## |(?![\s\S]))/gim;
  while ((match = boldQPattern.exec(section)) !== null) {
    const question = match[1].trim();
    const answer = match[2].trim().replace(/\n+/g, " ").slice(0, 600);
    if (question && answer) pairs.push({ question, answer });
  }
  if (pairs.length > 0) return pairs;

  // Strategy 3: **Q:** question / **A:** answer (legacy fallback)
  const qaPattern = /\*\*Q[:\.]?\*\*\s*(.+?)\n\*\*A[:\.]?\*\*\s*([\s\S]*?)(?=\n\*\*Q|(?![\s\S]))/gi;
  while ((match = qaPattern.exec(section)) !== null) {
    const question = match[1].trim();
    const answer = match[2].trim().replace(/\n+/g, " ").slice(0, 600);
    if (question && answer) pairs.push({ question, answer });
  }

  return pairs;
}

/**
 * Extract HowTo steps from a markdown body.
 *
 * Looks for numbered list items with bold titles:
 * "1. **Step name**: description"
 *
 * Returns [] if fewer than 2 steps are found.
 */
export function extractHowToSteps(body: string): { name: string; text: string }[] {
  const steps: { name: string; text: string }[] = [];
  const stepPattern = /^\d+\.\s+\*\*([^*]+)\*\*[:\s]*(.*)/gm;
  let match: RegExpExecArray | null;

  while ((match = stepPattern.exec(body)) !== null) {
    const name = match[1].trim();
    const text = match[2].trim().slice(0, 500);
    if (name) steps.push({ name, text: text || name });
  }

  return steps.length >= 2 ? steps : [];
}
