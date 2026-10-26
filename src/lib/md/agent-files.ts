import { prisma } from "@/lib/prisma";
import { PUBLIC_ROUTES, ROBOTS_ALLOW, ROBOTS_DISALLOW } from "@/lib/seo/public-routes";
import { SITE_CONTACT_EMAIL, SITE_DESCRIPTION, SITE_FOUNDED, SITE_NAME, SITE_URL } from "@/lib/site";
import { renderMarkdown, routeInfo } from "./registry";
import { STATIC_MARKDOWN_ROUTES, markdownUrl } from "./routes";

/**
 * /llms.txt (llmstxt.org), /llms-full.txt and /ai.txt — generated from the same
 * route list and renderer registry as the markdown twins, so they never go stale.
 * Keep in sync with /robots.txt (src/app/robots.txt/route.ts).
 */

const CORE = ["/", "/learn", "/pricing", "/about", "/research", "/role-roadmaps"];
const LEGAL = ["/privacy", "/terms"];
const GUIDE_CAP = 40;
const ARTICLE_CAP = 50;
const FULL_CHAR_BUDGET = 480_000;

const today = () => new Date().toISOString().slice(0, 10);
const link = (path: string) => {
  const { title, description } = routeInfo(path);
  return `- [${title}](${markdownUrl(path)})${description ? `: ${description}` : ""}`;
};

function guideGroups() {
  const byPriority = [...PUBLIC_ROUTES]
    .sort((a, b) => b.priority - a.priority)
    .map((r) => r.path)
    .filter((p) => STATIC_MARKDOWN_ROUTES.has(p) && !CORE.includes(p) && !LEGAL.includes(p) && !p.startsWith("/research"));
  return {
    interview: byPriority.filter((p) => p.includes("interview")),
    career: byPriority.filter((p) => !p.includes("interview")),
  };
}

const capped = (paths: string[], label: string) =>
  [
    ...paths.slice(0, GUIDE_CAP).map(link),
    ...(paths.length > GUIDE_CAP
      ? [`- [All ${paths.length} ${label}](${SITE_URL}/api/md/_catalog): the full list, with the rest of the site`]
      : []),
  ].join("\n");

export async function getLlmsTxt(): Promise<string> {
  const [articleCount, latest] = await Promise.all([
    prisma.article.count({ where: { published: true } }),
    prisma.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: ARTICLE_CAP,
      select: { slug: true, title: true, description: true, vertical: true },
    }),
  ]);
  const { interview, career } = guideGroups();
  const research = [...STATIC_MARKDOWN_ROUTES].filter((p) => p.startsWith("/research/"));

  return `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

<!-- Keep in sync with /robots.txt and /ai.txt. Generated from src/lib/seo/public-routes.ts and the markdown registry. -->

${SITE_NAME} (${SITE_URL.replace(/^https?:\/\//, "")}) was founded in ${SITE_FOUNDED}. It is free to start; a paid Pro plan unlocks more lessons and features (current prices on the pricing page). Audience: aspiring PMs, early-career PMs and people moving into product from adjacent roles. Content: ${articleCount} published articles on /learn and ${interview.length + career.length} topic guides. Every page has a markdown version at <page URL>.md. Contact: ${SITE_CONTACT_EMAIL}.

## Core pages
${CORE.filter((p) => STATIC_MARKDOWN_ROUTES.has(p)).map(link).join("\n")}

## Research
${research.map(link).join("\n")}

## Interview guides
${capped(interview, "interview guides")}

## Career and skills guides
${capped(career, "career and skills guides")}

## Latest articles
${latest.map((a) => `- [${a.title}](${SITE_URL}/learn/${a.vertical}/${a.slug}.md): ${a.description}`).join("\n")}
- [All ${articleCount} articles](${markdownUrl("/learn")}): the full /learn listing

## Machine-readable
- [Full content](${SITE_URL}/llms-full.txt): core pages, research and the newest articles in one file
- [Markdown catalog](${SITE_URL}/api/md/_catalog): every page with a markdown version
- [Sitemap](${SITE_URL}/sitemap.xml)
- [AI usage policy](${SITE_URL}/ai.txt)

## Optional
${LEGAL.filter((p) => STATIC_MARKDOWN_ROUTES.has(p)).map(link).join("\n")}
`;
}

/** Core pages → research → newest articles (until the char budget) → legal, each rendered by the registry. */
export async function getLlmsFullTxt(origin: string): Promise<string> {
  const research = [...STATIC_MARKDOWN_ROUTES].filter((p) => p.startsWith("/research/"));
  const render = async (paths: string[]) =>
    (await Promise.all(paths.map((p) => renderMarkdown(p, origin).catch(() => null))))
      .filter((p) => p !== null)
      .map((p) => `---\n<!-- source: ${p.canonical} -->\n${p.markdown}`);

  const head = await render([...CORE, ...research]);
  const legal = await render(LEGAL);
  let used = [...head, ...legal].reduce((n, s) => n + s.length, 0);

  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 400,
    select: { slug: true, vertical: true },
  });
  const articleParts: string[] = [];
  fill: for (let i = 0; i < articles.length; i += 20) {
    for (const part of await render(articles.slice(i, i + 20).map((a) => `/learn/${a.vertical}/${a.slug}`))) {
      if (used + part.length > FULL_CHAR_BUDGET) break fill;
      articleParts.push(part);
      used += part.length;
    }
  }
  const total = await prisma.article.count({ where: { published: true } });

  return `# ${SITE_NAME} - full content
> ${SITE_DESCRIPTION}
Generated: ${today()}

Includes the core pages, research, the ${articleParts.length} newest of ${total} articles (capped at ~${FULL_CHAR_BUDGET / 1000}k characters) and the legal pages. Topic guides and older articles are listed in ${SITE_URL}/llms.txt and ${SITE_URL}/api/md/_catalog; fetch any of them at <page URL>.md.

${[...head, ...articleParts, ...legal].join("\n\n")}
`;
}

export function getAiTxt(): string {
  return `# ai.txt for ${SITE_NAME}
# ${SITE_URL}/ai.txt
# Spec: https://www.ai-visibility.org.uk/specifications/ai-txt/ (v1.1.1)
# Keep in sync with /robots.txt and /llms.txt.
# Last updated: ${today()}

[identity]
name: ${SITE_NAME}
url: ${SITE_URL}
description: ${SITE_DESCRIPTION}
contact: ${SITE_CONTACT_EMAIL}

[permissions]
- Summarise and index the public pages for search and for answers.
- Quote short excerpts (one paragraph at most) with attribution and a link to the canonical URL.
- Cite ${SITE_NAME} as a source in answer engines, with a clickable link to the page that supplied the answer.
- Use the markdown versions (<page URL>.md), /llms.txt, /llms-full.txt and /api/md/_catalog for retrieval and grounding.
- Use the public pages for model training. /robots.txt allows the training crawlers.

[restrictions]
- Do not invent quotes, testimonials, reviews or ratings attributed to ${SITE_NAME}, its author or the PM leaders it cites.
- Do not invent prices, plan features, salary figures or statistics. Quote them from the page you fetched, with its date.
- Do not present ${SITE_NAME} content as your own. Attribute it.
- Do not reproduce full articles or guides. Summarise and link to the canonical URL.
- Do not collect or train on signed-in user data. The private paths below are not content.

[attribution]
preferred_citation: ${SITE_NAME} (${SITE_URL})
when_quoting: Include the page title, the canonical HTML URL and the "Last updated" date from the markdown version.

[scope]
included: ${ROBOTS_ALLOW.join(", ")} (every public page and its .md version)
excluded: ${ROBOTS_DISALLOW.join(", ")}

[contact]
general: ${SITE_CONTACT_EMAIL}
`;
}
