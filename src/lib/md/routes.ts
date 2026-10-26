import { PUBLIC_ROUTES } from "@/lib/seo/public-routes";
import { SITE_URL } from "@/lib/site";

/**
 * Which routes have a markdown twin. Edge-safe (no Prisma) so middleware can
 * decide on the rewrite. Every page.tsx must be covered here: a public static
 * route (PUBLIC_ROUTES), a dynamic pattern below, or one of the two lists with
 * a reason — src/lib/md/__tests__/coverage.test.ts enforces it.
 */

export const ARTICLE_ROUTE = /^\/learn\/([^/]+)\/([^/]+)$/;

/** Public pages with nothing an agent can read: interactive app screens that load content client-side. */
export const MARKDOWN_SKIP: Record<string, string> = {
  "/explore": "interactive lesson browser; content loads client-side",
  "/interview-prep": "interactive practice screen; content loads client-side",
  "/interview-sprint": "interactive practice screen; content loads client-side",
  "/jobs": "live jobs board; content loads client-side",
  "/daily-challenge": "interactive daily challenge",
  "/leaderboard": "live leaderboard",
  "/social": "interactive social feed",
  "/invite": "invite flow",
  "/login": "auth form (noindex)",
  "/signup": "auth form (noindex)",
};

/** Never exposed as markdown: signed-in, admin, payment and token-bearing pages. */
export const PRIVATE_ROUTES: Record<string, string> = {
  "/admin": "admin console",
  "/dashboard": "signed-in app",
  "/onboarding": "signed-in onboarding",
  "/notes": "signed-in notes",
  "/community": "signed-in community",
  "/reset-password": "token-bearing auth flow",
  "/checkout/razorpay": "payment flow",
  "/lesson/[id]": "signed-in lesson player",
};

export const STATIC_MARKDOWN_ROUTES = new Set(
  PUBLIC_ROUTES.map((r) => r.path).filter((path) => !(path in MARKDOWN_SKIP)),
);

export function isMarkdownRoute(path: string): boolean {
  return STATIC_MARKDOWN_ROUTES.has(path) || ARTICLE_ROUTE.test(path);
}

/** Absolute URL of a route's markdown twin: "/" → /index.md. */
export function markdownUrl(path: string): string {
  return `${SITE_URL}${path === "/" ? "/index" : path}.md`;
}
