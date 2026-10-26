# Markdown twins for a Next.js site whose content lives in JSX

## The problem

Each public page needed a `<url>.md` version for AI agents, but ~450 of the 461 pages keep their text inline in JSX, so there is no data source to render markdown from.

## The approach

1. Sort the routes by where their content lives. `/learn/[vertical]/[slug]` reads `Article.body` from Prisma, and that body is already markdown. `/learn` is a DB listing. Every other route in `src/lib/seo/public-routes.ts` is a static JSX page.
2. Render the DB routes directly (`renderArticle`, `renderLearnIndex` in `src/lib/md/registry.ts`). Use `findUnique({ where: { slug, published: true } })` so a draft returns null and becomes a markdown 404.
3. For the JSX pages, fetch the page's own HTML (`fetch(new URL(path, req.nextUrl.origin), { headers: { accept: "text/html" }, redirect: "manual" })`) and convert only `<main>` with cheerio (`src/lib/md/html.ts`). The HTML already holds the final text, so no second copy of the content can drift.
4. Route everything through one handler. `src/middleware.ts` rewrites `*.md` and requests whose `Accept` ranks `text/markdown` above `text/html` to `/api/md/<path>`. The handler sends the markdown headers (`X-Markdown-Tokens`, `Vary: Accept`, `Link rel=canonical`, `X-Robots-Tag: noindex, follow`).
5. Generate `llms.txt`, `llms-full.txt`, `ai.txt` and the sitemap from the same route list and renderer, so the agent files cannot list pages that do not exist. The old hand-written `llms.txt` linked to two 404 pages.
6. Test with `next dev` on a scratch Postgres DB (`createdb pmstreak_md_check`, `prisma db push`, 2 published articles + 1 draft). curl each case: `.md`, `Accept: text/markdown`, `Accept: */*` (must stay HTML), a browser Accept header, a draft slug, OPTIONS, HEAD, and a missing page.

## The judgment calls

- No per-page markdown files and no MDX migration of 450 pages. Either one duplicates the content, and the copies drift from the HTML.
- `*/*` and a missing `Accept` header stay HTML. Negotiate markdown only when its q-value is strictly higher than `text/html`. Otherwise curl and some crawlers get markdown at the canonical URL.
- `prefersMarkdown` and the route allowlist live in edge-safe files (`http.ts`, `routes.ts`) with no Prisma import, because middleware runs on the edge.
- `llms-full.txt` renders articles in batches of 20 under a 480k-character budget. Rendering all of them at once would self-fetch hundreds of pages in parallel.
- The middleware matcher excludes `api/`, `_next/`, `.well-known/` and static extensions, so the `/api/md` rewrite cannot loop.

## The reusable rule

When content exists only as rendered UI, convert the rendered HTML from one place instead of making a second copy of the content, and generate every index file (llms.txt, sitemap) from the same route list that serves the pages.
