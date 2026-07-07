#!/usr/bin/env node
/**
 * scripts/bing-gsc-import.mjs
 *
 * Automates the ONE manual step left in the learnanything.pro SEO rollout:
 * verify the site in Bing Webmaster Tools via "Import from Google Search
 * Console", then submit the sitemap. Everything else (GEO pages, IndexNow,
 * GSC sitemap resubmit) is already done in prod.
 *
 * WHY a browser script and not an API call: BWT's frictionless GSC import is
 * UI-only, and it needs your logged-in Google session. So this drives your REAL
 * Chrome profile (which is already signed in as namangoyal21197@gmail.com) with
 * Playwright — no passwords are ever typed or stored.
 *
 * PREREQ: fully QUIT Google Chrome first (Cmd+Q). Chrome locks its profile, so
 * Playwright can't attach the real profile while Chrome is open.
 *
 *   cd ~/pmstreak
 *   osascript -e 'quit app "Google Chrome"'   # or Cmd+Q
 *   node scripts/bing-gsc-import.mjs
 *
 * It runs HEADED (you'll see the window) and NON-destructive: it only clicks
 * through Import + sitemap submit. If a selector has drifted (BWT changes its
 * UI often), it screenshots to /tmp/bing-*.png, logs what it saw, and pauses so
 * you (or Codex) can finish that one click by hand — then press Enter to resume.
 *
 * Env overrides (all optional):
 *   SITE_HOST   default "learnanything.pro"
 *   SITEMAP_URL default "https://learnanything.pro/sitemap.xml"
 *   PROFILE_DIR default "Default"   (Chrome profile folder name)
 */
import { chromium } from "playwright";
import os from "node:os";
import path from "node:path";
import readline from "node:readline";

const SITE_HOST = process.env.SITE_HOST || "learnanything.pro";
const SITEMAP_URL = process.env.SITEMAP_URL || `https://${SITE_HOST}/sitemap.xml`;
const PROFILE_DIR = process.env.PROFILE_DIR || "Default";
const USER_DATA_DIR = path.join(os.homedir(), "Library/Application Support/Google/Chrome");
const SHOT = (n) => `/tmp/bing-${n}.png`;

const log = (...a) => console.log("•", ...a);
const pause = (msg) =>
  new Promise((res) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(`\n⏸  ${msg}\n   Do it in the window, then press Enter here to continue… `, () => {
      rl.close();
      res();
    });
  });

// Click the first selector that exists & is visible. Returns true if clicked.
async function clickFirst(page, selectors, { timeout = 8000 } = {}) {
  for (const sel of selectors) {
    const loc = page.locator(sel).first();
    try {
      await loc.waitFor({ state: "visible", timeout });
      await loc.click();
      log(`clicked: ${sel}`);
      return true;
    } catch {
      /* try next */
    }
  }
  return false;
}

async function main() {
  log(`Launching your Chrome profile (${PROFILE_DIR}) — must be quit first.`);
  const ctx = await chromium.launchPersistentContext(USER_DATA_DIR, {
    channel: "chrome",
    headless: false,
    viewport: null,
    args: [`--profile-directory=${PROFILE_DIR}`, "--no-first-run", "--no-default-browser-check"],
  }).catch((e) => {
    console.error(
      `\n✗ Could not open your Chrome profile. Is Chrome fully quit? (Cmd+Q)\n  ${e.message}\n`,
    );
    process.exit(1);
  });

  const page = ctx.pages()[0] || (await ctx.newPage());

  // 1. Land on BWT. If already signed in, this shows the dashboard or the add/import screen.
  log("Opening Bing Webmaster Tools…");
  await page.goto("https://www.bing.com/webmasters/home", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: SHOT("1-home") });

  // 2. Google sign-in interstitial ("You're signing back in to bing.com" → Continue).
  //    Session already exists, so this is a single confirm — no password.
  if (/accounts\.google\.com/.test(page.url())) {
    log("Google consent screen — confirming (no password, session already present)…");
    const ok = await clickFirst(page, [
      'button:has-text("Continue")',
      'text=Continue',
      '#confirm_yes',
    ]);
    if (!ok) await pause("Click Continue on the Google sign-in screen.");
    await page.waitForTimeout(3000);
    await page.screenshot({ path: SHOT("2-after-google") });
  }

  // 3. Kick off "Import from Google Search Console".
  log("Looking for the GSC Import entry point…");
  const importStarted = await clickFirst(
    page,
    [
      'button:has-text("Import")',
      'text=Import your sites from Google Search Console',
      'text=Import from Google Search Console',
      'a:has-text("Import")',
    ],
    { timeout: 12000 },
  );
  if (!importStarted) {
    await page.screenshot({ path: SHOT("3-no-import") });
    await pause(
      `Couldn't auto-find the "Import" button (screenshot: ${SHOT("3-no-import")}).\n` +
        `   On the BWT home there are two cards: "Import" (GSC) and "Add site manually".\n` +
        `   Click Import, allow the Google connection, then come back.`,
    );
  }
  await page.waitForTimeout(3000);

  // 4. A second Google OAuth (grant BWT read access to GSC) may appear.
  if (/accounts\.google\.com/.test(page.url())) {
    log("Granting BWT access to Search Console…");
    const ok = await clickFirst(page, [
      'button:has-text("Continue")',
      'button:has-text("Allow")',
      'text=Continue',
    ]);
    if (!ok) await pause("Click Continue/Allow to let Bing read your Search Console properties.");
    await page.waitForTimeout(3500);
  }
  await page.screenshot({ path: SHOT("4-properties") });

  // 5. Select the property (learnanything.pro / sc-domain:learnanything.pro) and import.
  log(`Selecting ${SITE_HOST} and importing…`);
  // tick the checkbox next to the property row if present
  const row = page.locator(`text=/${SITE_HOST.replace(/\./g, "\\.")}/`).first();
  try {
    await row.waitFor({ state: "visible", timeout: 8000 });
    const cb = page.locator('input[type="checkbox"]').first();
    if (await cb.count()) await cb.check().catch(() => {});
  } catch {
    /* some flows import all props automatically */
  }
  const imported = await clickFirst(page, [
    'button:has-text("Import")',
    'button:has-text("Add")',
    'button:has-text("Confirm")',
  ]);
  if (!imported) {
    await page.screenshot({ path: SHOT("5-select") });
    await pause(
      `Select ${SITE_HOST} and click Import (screenshot: ${SHOT("5-select")}). ` +
        `Because you already own it in GSC, Bing auto-verifies — no DNS/HTML step.`,
    );
  }
  await page.waitForTimeout(4000);
  await page.screenshot({ path: SHOT("6-imported") });
  log(`Import done (or confirm in window). Screenshot: ${SHOT("6-imported")}`);

  // 6. Submit the sitemap so Bing gets all URLs at once.
  log("Submitting sitemap…");
  await page.goto("https://www.bing.com/webmasters/sitemaps", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);
  const openSubmit = await clickFirst(page, [
    'button:has-text("Submit sitemap")',
    'button:has-text("Submit Sitemap")',
    'text=Submit sitemap',
  ]);
  if (openSubmit) {
    const input = page.locator('input[type="text"], input[type="url"]').first();
    await input.waitFor({ state: "visible", timeout: 6000 }).catch(() => {});
    await input.fill(SITEMAP_URL).catch(() => {});
    const sent = await clickFirst(page, [
      'button:has-text("Submit")',
      'button:has-text("Send")',
      'button[type="submit"]',
    ]);
    log(sent ? `Sitemap submitted: ${SITEMAP_URL}` : "Fill dialog + click Submit by hand.");
  } else {
    await page.screenshot({ path: SHOT("7-sitemaps") });
    await pause(
      `On the Sitemaps page, paste ${SITEMAP_URL} and Submit ` +
        `(screenshot: ${SHOT("7-sitemaps")}).`,
    );
  }
  await page.waitForTimeout(2500);
  await page.screenshot({ path: SHOT("8-final") });

  log("\n✅ Flow complete. Verify in the window that learnanything.pro shows as verified");
  log(`   and the sitemap (${SITEMAP_URL}) is listed. Screenshots in /tmp/bing-*.png`);
  await pause("Review the window. Press Enter to close Chrome.");
  await ctx.close();
}

main().catch((e) => {
  console.error("✗", e);
  process.exit(1);
});
