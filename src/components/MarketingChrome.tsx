"use client";

import { usePathname } from "next/navigation";
import MarketingNav from "./MarketingNav";
import SiteFooter from "./SiteFooter";

/**
 * Injects the marketing nav + footer on public SEO/content pages.
 * App routes have their own Navbar; homepage/pricing/auth keep inline chrome.
 */
const EXCLUDED_PREFIXES = [
  "/dashboard", "/lesson", "/explore", "/social", "/leaderboard", "/jobs",
  "/interview-prep", "/interview-sprint", "/daily-challenge", "/onboarding",
  "/admin", "/notes", "/invite", "/checkout", "/community", "/research",
  "/login", "/signup", "/reset-password", "/pricing", "/api",
];

function isExcluded(pathname: string) {
  if (pathname === "/") return true;
  return EXCLUDED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export function MarketingHeader() {
  const pathname = usePathname();
  if (isExcluded(pathname)) return null;
  return <MarketingNav />;
}

export function MarketingFooter() {
  const pathname = usePathname();
  if (isExcluded(pathname)) return null;
  return <SiteFooter />;
}
