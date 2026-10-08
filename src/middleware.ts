import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isNoindexed } from "@/lib/pruned";

const COOKIE_NAME = "ab_uid";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days
const AB_PATHS = new Set(["/", "/pricing"]);

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // SEO prune: pruned pages stay live but tell crawlers not to index them.
  if (isNoindexed(pathname)) response.headers.set("X-Robots-Tag", "noindex");

  // Assign a stable A/B uid cookie on the experiment surfaces if not present
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
  // Every page route; skips API, Next internals and files with an extension.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
