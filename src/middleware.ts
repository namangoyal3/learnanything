import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prefersMarkdown } from "@/lib/md/http";
import { isMarkdownRoute, markdownUrl } from "@/lib/md/routes";

const COOKIE_NAME = "ab_uid";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days
const AB_PATHS = new Set(["/", "/pricing"]);

// Advertised on every HTML page so agents can find the machine-readable files.
const AGENT_LINKS = [
  '</llms.txt>; rel="describedby"; type="text/plain"',
  '</llms-full.txt>; rel="describedby"; type="text/plain"',
  '</ai.txt>; rel="describedby"; type="text/plain"',
].join(", ");

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Markdown twins: /pricing.md, /index.md, or Accept: text/markdown on an allowlisted
  // content route → the one markdown handler. Everything else is served as before.
  if (pathname.endsWith(".md")) {
    return NextResponse.rewrite(new URL(`/api/md${pathname.slice(0, -3)}`, request.url));
  }
  const markdownRoute = isMarkdownRoute(pathname);
  if (markdownRoute && prefersMarkdown(request.headers.get("accept"))) {
    return NextResponse.rewrite(new URL(`/api/md${pathname === "/" ? "/index" : pathname}`, request.url));
  }

  const response = NextResponse.next();
  response.headers.set(
    "Link",
    markdownRoute ? `<${markdownUrl(pathname)}>; rel="alternate"; type="text/markdown", ${AGENT_LINKS}` : AGENT_LINKS,
  );

  // Assign a stable A/B uid cookie if not present
  if (AB_PATHS.has(pathname) && !request.cookies.get(COOKIE_NAME)) {
    const uid = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    response.cookies.set(COOKIE_NAME, uid, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  }

  return response;
}

export const config = {
  // Pages and .md twins only: skip Next internals, API routes, .well-known and static files.
  matcher: [
    "/((?!_next/|api/|\\.well-known/|.*\\.(?:txt|xml|json|ico|png|jpe?g|gif|svg|webp|avif|css|js|map|woff2?|html|webmanifest)$).*)",
  ],
};
