import { NextResponse, type NextRequest } from "next/server";
import { MD_CORS, markdownResponse } from "@/lib/md/http";
import { notFoundMarkdown, renderCatalog, renderMarkdown } from "@/lib/md/registry";
import { SITE_URL } from "@/lib/site";

/**
 * The one markdown handler. Reached directly (/api/md/<path>) or through the
 * middleware rewrite of /<path>.md and of Accept: text/markdown requests.
 * Always answers in markdown — a missing route is a markdown 404, never HTML.
 */
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ path?: string[] }> };

async function handle(req: NextRequest, { params }: Ctx, head: boolean) {
  const { path = [] } = await params;
  const joined = `/${path.join("/")}`.replace(/\.md$/, "");
  const route = joined === "/index" ? "/" : joined;
  try {
    if (route === "/_catalog") {
      return markdownResponse(await renderCatalog(), { canonical: `${SITE_URL}/api/md/_catalog`, head });
    }
    const page = await renderMarkdown(route, req.nextUrl.origin);
    if (!page) return markdownResponse(notFoundMarkdown(route), { status: 404, head });
    return markdownResponse(page.markdown, {
      canonical: page.canonical,
      lastModified: page.lastModified,
      sMaxAge: page.isStatic ? 86400 : 3600,
      head,
    });
  } catch (err) {
    console.error("[md] render failed", { route, err });
    return markdownResponse(`# Temporarily unavailable\n\nThe markdown version of ${route} could not be rendered. Try the HTML page: ${SITE_URL}${route}\n`, {
      status: 503,
      head,
    });
  }
}

export function GET(req: NextRequest, ctx: Ctx) {
  return handle(req, ctx, false);
}

export function HEAD(req: NextRequest, ctx: Ctx) {
  return handle(req, ctx, true);
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: MD_CORS });
}
