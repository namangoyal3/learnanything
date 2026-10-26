import { ROBOTS_ALLOW, ROBOTS_DISALLOW } from "@/lib/seo/public-routes";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * /robots.txt — a route (not robots.ts) so it can carry comments that point
 * agents at /llms.txt and /ai.txt. Every crawler gets the same public/private
 * split from src/lib/seo/public-routes.ts, which ai.txt's [scope] also reads.
 */
const GROUPS: { comment: string; bots: string[] }[] = [
  {
    comment: "Answer engines: search crawlers and user-triggered fetchers. These decide whether AI answers can cite us.",
    bots: ["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User"],
  },
  {
    comment: "Training crawlers: allowed (owner decision, 2026-10-26).",
    bots: ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot", "Bytespider"],
  },
  {
    comment: "Search engines and everyone else.",
    bots: ["Googlebot", "GoogleOther", "Applebot", "FacebookBot", "*"],
  },
];

export function GET() {
  const rules = [
    ...ROBOTS_ALLOW.map((p) => `Allow: ${p}`),
    ...ROBOTS_DISALLOW.map((p) => `Disallow: ${p}`),
  ].join("\n");
  const groups = GROUPS.map(
    ({ comment, bots }) => `# ${comment}\n${bots.map((b) => `User-Agent: ${b}\n${rules}`).join("\n\n")}`,
  ).join("\n\n");
  const body = `# ${SITE_NAME} - ${SITE_URL}
# Agent files: /llms.txt (site map for language models), /llms-full.txt (full content), /ai.txt (usage policy).
# Every public page has a markdown twin at <page>.md. Keep in sync with /llms.txt and /ai.txt.

${groups}

Host: ${SITE_URL}
Sitemap: ${SITE_URL}/sitemap.xml
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600, s-maxage=86400" },
  });
}
