/**
 * Site identity — the one place for name, URL, description and contact.
 * Read by the Organization JSON-LD (layout), JsonLd helpers, /llms.txt, /ai.txt
 * and the markdown twins, so the facts agents see always match.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://learnanything.pro";
export const SITE_NAME = "PM Streak";
export const SITE_DESCRIPTION =
  "PM Streak delivers daily 2-minute product management lessons from 300+ expert PM interviews with streak tracking, XP, leaderboards, and AI-powered content generation.";
export const SITE_CONTACT_EMAIL = "hello@learnanything.pro";
export const SITE_FOUNDED = "2024";
