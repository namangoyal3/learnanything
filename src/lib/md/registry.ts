import { prisma } from "@/lib/prisma";
import { pageDates } from "@/lib/seo/page-dates";
import { SITE_URL } from "@/lib/site";
import pageMeta from "../../../scripts/seo-page-meta.json";
import { htmlToMarkdown } from "./html";
import { ARTICLE_ROUTE, STATIC_MARKDOWN_ROUTES, markdownUrl } from "./routes";

/**
 * Markdown renderer registry: route → markdown twin of the HTML page.
 *
 *   /learn/[vertical]/[slug]  Article.body from the DB (already markdown)
 *   /learn                    published-article listing from the DB
 *   every other public route  the page's own server-rendered <main>, converted
 *                             (those pages keep their content inline in JSX)
 *
 * New static page → add it to PUBLIC_ROUTES; nothing else. New dynamic page
 * type → add a renderer branch in renderMarkdown() and a pattern in routes.ts.
 */

export type MarkdownPage = { markdown: string; canonical: string; lastModified?: Date; isStatic: boolean };

const VERTICAL_LABELS: Record<string, string> = {
  pm: "Product Management",
  design: "Design",
  engineering: "Engineering",
  growth: "Growth",
};

const meta = pageMeta as Record<string, { title: string; description: string }>;

const isoDay = (d: Date) => d.toISOString().slice(0, 10);
const linkText = (s: string) => s.replace(/([[\]])/g, "\\$1");
const absolutize = (md: string) => md.replace(/\]\(\//g, `](${SITE_URL}/`);

function page(title: string, summary: string, canonical: string, updated: string, body: string): string {
  return `# ${title}\n\n> ${summary}\n\nCanonical: ${canonical}\nLast updated: ${updated}\n\n${body.trim()}\n`;
}

/** Title + one-line description of a static route, for llms.txt and the catalog. */
export function routeInfo(path: string): { title: string; description: string } {
  return meta[path] ?? { title: path.slice(1).replace(/[-/]/g, " ") || "Home", description: "" };
}

async function renderArticle(slug: string): Promise<MarkdownPage | null> {
  const article = await prisma.article.findUnique({
    where: { slug, published: true },
    select: { title: true, description: true, body: true, vertical: true, publishedAt: true, updatedAt: true },
  });
  if (!article) return null;
  const related = await prisma.article.findMany({
    where: { published: true, vertical: article.vertical, slug: { not: slug } },
    take: 3,
    orderBy: { publishedAt: "desc" },
    select: { slug: true, title: true, description: true, vertical: true },
  });
  const canonical = `${SITE_URL}/learn/${article.vertical}/${slug}`;
  // The page renders its own <h1> from the title; drop a duplicate one at the top of the body.
  const body = absolutize(article.body.replace(/^\s*#\s+[^\n]*\n/, "")).trim();
  const published = article.publishedAt ? `Published: ${isoDay(article.publishedAt)}\n\n` : "";
  const relatedMd = related.length
    ? `\n\n## Related\n${related
        .map((r) => `- [${linkText(r.title)}](${SITE_URL}/learn/${r.vertical}/${r.slug}) - ${r.description}`)
        .join("\n")}`
    : "";
  return {
    markdown: page(article.title, article.description, canonical, isoDay(article.updatedAt), `${published}${body}${relatedMd}`),
    canonical,
    lastModified: article.updatedAt,
    isStatic: false,
  };
}

async function renderLearnIndex(): Promise<MarkdownPage> {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: { slug: true, title: true, description: true, vertical: true, updatedAt: true },
  });
  const verticals = [...new Set(articles.map((a) => a.vertical))];
  const body = verticals
    .map((v) => {
      const items = articles
        .filter((a) => a.vertical === v)
        .map((a) => `- [${linkText(a.title)}](${SITE_URL}/learn/${a.vertical}/${a.slug}) - ${a.description}`);
      return `## ${VERTICAL_LABELS[v] ?? v}\n\n${items.join("\n")}`;
    })
    .join("\n\n");
  const newest = articles.reduce<Date | undefined>((d, a) => (!d || a.updatedAt > d ? a.updatedAt : d), undefined);
  const { title, description } = routeInfo("/learn");
  const canonical = `${SITE_URL}/learn`;
  return {
    markdown: page(title, description, canonical, isoDay(newest ?? new Date()), body || "No articles are published yet."),
    canonical,
    lastModified: newest,
    isStatic: false,
  };
}

/** Fetch the page's own HTML (anonymous, through the CDN) and convert its <main>. */
async function renderStaticPage(path: string, origin: string): Promise<MarkdownPage | null> {
  const res = await fetch(new URL(path, origin), {
    headers: { accept: "text/html", "user-agent": "PMStreakMarkdown/1.0 (+https://learnanything.pro/llms.txt)" },
    redirect: "manual",
    signal: AbortSignal.timeout(10_000),
  });
  if (res.status !== 200) return null;
  const converted = htmlToMarkdown(await res.text(), SITE_URL);
  if (converted.noindex) return null;
  const canonical = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  const { modified } = pageDates(path);
  // The meta title names the page better than a marketing <h1> ("Learn PM like a pro" on /pricing).
  const title = meta[path]?.title ?? converted.title;
  const summary = converted.description || routeInfo(path).description;
  return {
    markdown: page(title, summary, canonical, modified, converted.body),
    canonical,
    lastModified: new Date(`${modified}T00:00:00Z`),
    isStatic: true,
  };
}

/** The markdown twin of `path`, or null when the route has none (→ markdown 404). */
export async function renderMarkdown(path: string, origin: string): Promise<MarkdownPage | null> {
  const article = ARTICLE_ROUTE.exec(path);
  if (article) return renderArticle(decodeURIComponent(article[2]));
  if (path === "/learn") return renderLearnIndex();
  if (STATIC_MARKDOWN_ROUTES.has(path)) return renderStaticPage(path, origin);
  return null;
}

/** Every addressable markdown route: static pages first, then published articles. */
export async function listMarkdownRoutes(): Promise<{ path: string; title: string; description: string }[]> {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: { slug: true, title: true, description: true, vertical: true },
  });
  return [
    ...[...STATIC_MARKDOWN_ROUTES].map((path) => ({ path, ...routeInfo(path) })),
    ...articles.map((a) => ({ path: `/learn/${a.vertical}/${a.slug}`, title: a.title, description: a.description })),
  ];
}

export async function renderCatalog(): Promise<string> {
  const routes = await listMarkdownRoutes();
  const lines = routes.map((r) => `- [${linkText(r.title)}](${markdownUrl(r.path)})${r.description ? ` - ${r.description}` : ""}`);
  return `# Markdown catalog\n\n> Every page on ${SITE_URL} that has a markdown twin (${routes.length} routes). Append .md to any page URL, or send Accept: text/markdown.\n\n${lines.join("\n")}\n`;
}

export function notFoundMarkdown(path: string): string {
  return `# Not found\n\nThere is no markdown page at ${path}. Every page is listed in ${SITE_URL}/llms.txt and ${SITE_URL}/api/md/_catalog.\n`;
}
