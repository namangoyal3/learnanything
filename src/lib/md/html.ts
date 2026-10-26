import * as cheerio from "cheerio";

// domhandler is only a transitive dependency (pnpm does not hoist it), so take its node types from cheerio.
type AnyNode = Extract<Parameters<typeof cheerio.load>[0], { type: unknown }>;
type Element = Extract<AnyNode, { attribs: unknown }>;

/**
 * Server-rendered HTML → markdown, for static pages whose content lives inline in
 * JSX (the ~450 SEO guides) and so has no data source to render from. Reads only
 * <main>; drops scripts, forms, buttons and signup/login CTAs, keeps headings,
 * lists, tables, links (made absolute) and FAQ <details>.
 */

const SKIP_TAGS = new Set([
  "script", "style", "svg", "form", "button", "img", "picture", "video", "input", "label", "select",
  "textarea", "noscript", "template", "iframe", "nav", "footer", "dialog",
]);
const BLOCK_TAGS = new Set([
  "p", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6", "details", "summary", "section", "article",
  "header", "aside", "div", "main", "blockquote", "pre", "table", "figure", "figcaption", "dl", "dt", "dd", "hr",
]);
const CTA_HREF = /^\/(signup|login|onboarding|dashboard)(?:[/?#]|$)/;

const isElement = (node: AnyNode): node is Element => node.type === "tag" || node.type === "script" || node.type === "style";

function skipped(el: Element): boolean {
  if (SKIP_TAGS.has(el.name) || el.attribs["aria-hidden"] === "true" || el.attribs.hidden !== undefined) return true;
  return el.name === "a" && CTA_HREF.test(el.attribs.href ?? "");
}

// JSX string literals like "What&apos;s" are escaped once more by React and show up as literal entities.
const decodeLeftovers = (s: string) =>
  s.replace(/&apos;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&");

const squash = (s: string) => s.replace(/\s+/g, " ").trim();
const escapeMd = (s: string) => s.replace(/([\\`*_[\]])/g, "\\$1");

function plainText(node: AnyNode): string {
  if (node.type === "text") return decodeLeftovers(node.data);
  if (!isElement(node) || SKIP_TAGS.has(node.name)) return "";
  if (node.name === "br") return " ";
  return node.children.map(plainText).join("");
}

function joinInline(nodes: AnyNode[], base: string): string {
  const parts: string[] = [];
  let prevElement = false;
  for (const node of nodes) {
    const out = inline(node, base);
    // <b>8</b><span>engines</span> has no space in the source; the eye adds one.
    if (isElement(node) && prevElement && out && !/\s$/.test(parts[parts.length - 1])) parts.push(" ");
    parts.push(out);
    if (out) prevElement = isElement(node);
  }
  return parts.join("");
}

function inline(node: AnyNode, base: string): string {
  if (node.type === "text") return escapeMd(decodeLeftovers(node.data).replace(/\s+/g, " "));
  if (!isElement(node) || skipped(node)) return "";
  if (node.name === "br") return " ";
  const inner = joinInline(node.children, base);
  if (!inner.trim()) return inner;
  switch (node.name) {
    case "b":
    case "strong":
      return `**${inner.trim()}**`;
    case "em":
    case "i":
      return `*${inner.trim()}*`;
    case "code":
      return `\`${plainText(node).trim()}\``;
    case "a": {
      const href = node.attribs.href;
      if (!href || href.startsWith("javascript:")) return inner;
      const text = inner.trim().replace(/\s*(?:Read (?:guide|more)|Learn more)?\s*→$/i, "") || inner.trim();
      return `[${text}](${new URL(href, base).toString()})`;
    }
    default:
      return inner;
  }
}

function table(el: Element): string[] {
  const rows = cheerio
    .load(el)("tr")
    .toArray()
    .map((tr) => tr.children.filter(isElement).filter((c) => c.name === "td" || c.name === "th"))
    .map((cells) => cells.map((c) => squash(plainText(c)).replace(/\|/g, "\\|")))
    .filter((cells) => cells.length > 0);
  if (rows.length === 0) return [];
  const width = Math.max(...rows.map((r) => r.length));
  const line = (cells: string[]) => `| ${[...cells, ...Array(width - cells.length).fill("")].join(" | ")} |`;
  return [[line(rows[0]), line(Array(width).fill("---")), ...rows.slice(1).map(line)].join("\n")];
}

// Card UIs put a marker ("1.", "❌", "✓") in a <span> beside a <p>; it belongs on the same line.
const MARKER = /^(?:\d{1,2}[.)]|[^\p{L}\p{N}\s]{1,3})$/u;

function blocks(nodes: AnyNode[], base: string): string[] {
  const out: string[] = [];
  let run: AnyNode[] = [];
  let marker = "";
  const push = (parts: string[]) => {
    if (marker && parts[0] && !parts[0].startsWith("#")) parts = [`${marker} ${parts[0]}`, ...parts.slice(1)];
    else if (marker) out.push(marker);
    marker = "";
    out.push(...parts);
  };
  const flush = () => {
    const nodesInRun = run;
    run = [];
    const elements = nodesInRun.filter(isElement).filter((e) => !skipped(e));
    // A bare row of links (a "Related guides" grid) reads as a list, not one long paragraph.
    const linkRow =
      elements.length >= 2 &&
      elements.every((e) => e.name === "a") &&
      nodesInRun.every((n) => n.type !== "text" || !n.data.trim());
    if (linkRow) {
      push([elements.map((a) => `- ${squash(inline(a, base))}`).join("\n")]);
      return;
    }
    const para = squash(joinInline(nodesInRun, base));
    if (!para) return;
    if (MARKER.test(para) && !marker) marker = para;
    else push([para]);
  };
  for (const child of nodes) {
    if (!isElement(child) || (!BLOCK_TAGS.has(child.name) && !skipped(child))) {
      run.push(child);
      continue;
    }
    flush();
    if (!skipped(child)) push(block(child, base));
  }
  flush();
  if (marker) out.push(marker);
  return out;
}

function block(el: Element, base: string): string[] {
  const heading = /^h([1-6])$/.exec(el.name);
  if (heading) {
    const text = squash(plainText(el));
    return text ? [`${"#".repeat(Math.min(Number(heading[1]), 4))} ${text}`] : [];
  }
  switch (el.name) {
    case "p":
    case "figcaption":
    case "dt":
    case "dd": {
      const para = squash(joinInline(el.children, base));
      return para ? [para] : [];
    }
    case "ul":
    case "ol": {
      const items = el.children.filter(isElement).filter((li) => li.name === "li" && !skipped(li));
      const lines = items
        .map((li) => squash(blocks(li.children, base).join(" ")))
        .filter(Boolean)
        .map((text, i) => (el.name === "ol" ? `${i + 1}. ${text}` : `- ${text}`));
      return lines.length ? [lines.join("\n")] : [];
    }
    case "details": {
      const summary = el.children.filter(isElement).find((c) => c.name === "summary");
      const answer = blocks(el.children.filter((c) => c !== summary), base);
      return summary ? [`### ${squash(plainText(summary))}`, ...answer] : answer;
    }
    case "pre":
      return [`\`\`\`\n${plainText(el).replace(/\n+$/, "")}\n\`\`\``];
    case "blockquote":
      return blocks(el.children, base).map((b) => `> ${b}`);
    case "table":
      return table(el);
    case "hr":
      return [];
    default:
      return blocks(el.children, base);
  }
}

/** Drop headings left with no content under them (e.g. a CTA section whose only link was removed). */
function dropEmptyHeadings(parts: string[]): string[] {
  const level = (s: string) => /^(#{1,6}) /.exec(s)?.[1].length ?? 0;
  return parts.filter((part, i) => {
    const own = level(part);
    if (!own) return true;
    const next = parts[i + 1];
    return next !== undefined && (level(next) === 0 || level(next) > own);
  });
}

export type ConvertedPage = { title: string; description: string; body: string; noindex: boolean };

export function htmlToMarkdown(html: string, base: string): ConvertedPage {
  const $ = cheerio.load(html);
  const root = $("main").first().get(0) ?? $("body").first().get(0);
  const parts = root ? blocks(root.children, base) : [];
  const h1 = parts.findIndex((p) => p.startsWith("# "));
  const title = h1 >= 0 ? parts[h1].slice(2) : squash($("title").first().text());
  if (h1 >= 0) parts.splice(h1, 1);
  return {
    title,
    description: squash($('meta[name="description"]').attr("content") ?? ""),
    body: dropEmptyHeadings(parts).join("\n\n"),
    noindex: /noindex/i.test($('meta[name="robots"]').attr("content") ?? ""),
  };
}
