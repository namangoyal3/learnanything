import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const BASE = 'https://learnanything.pro';
const events = [];
const consoleLines = [];
const gaHits = [];
const serverApiHits = [];

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  viewport: { width: 1280, height: 800 },
});
const page = await ctx.newPage();

page.on('console', (msg) => {
  const text = `[${msg.type()}] ${msg.text()}`;
  consoleLines.push(text);
});

page.on('request', (req) => {
  const url = req.url();
  if (url.includes('google-analytics.com') || url.includes('googletagmanager.com')) {
    gaHits.push({ ts: Date.now(), method: req.method(), url });
  }
  if (url.startsWith(BASE) && (url.includes('/api/') || url.includes('/pricing') || url.endsWith('/'))) {
    serverApiHits.push({ ts: Date.now(), method: req.method(), url });
  }
});

async function step(name, fn) {
  console.log(`\n=== STEP: ${name} ===`);
  const tsBefore = Date.now();
  try {
    await fn();
  } catch (e) {
    console.log(`step error: ${e.message}`);
  }
  await page.waitForTimeout(1500);
  const tsAfter = Date.now();
  events.push({ name, tsBefore, tsAfter, url: page.url() });
  console.log(`now at: ${page.url()}`);
}

await step('1-load-homepage', async () => {
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 });
});

await step('2-click-hero-cta', async () => {
  // hero CTA is likely the first prominent link/button
  const heroSelectors = [
    'a[href*="/pricing"]:has-text("Start"), a[href*="/pricing"]:has-text("trial"), a[href*="/pricing"]:has-text("Try"), a[href*="/pricing"]:has-text("Begin")',
    'a[href*="/pricing"]',
    'button:has-text("Start"), button:has-text("Try"), button:has-text("Begin")',
  ];
  for (const sel of heroSelectors) {
    const el = page.locator(sel).first();
    if (await el.count()) {
      await el.click();
      return;
    }
  }
  // fallback: go to /pricing directly
  await page.goto(`${BASE}/pricing`, { waitUntil: 'domcontentloaded' });
});

await step('3-on-pricing-page', async () => {
  if (!page.url().includes('/pricing')) {
    await page.goto(`${BASE}/pricing`, { waitUntil: 'domcontentloaded' });
  }
});

await step('4-hit-api-checkout-anon', async () => {
  // direct API hit (anonymous) — should fire `checkout_initiated` server event,
  // then `checkout_error` because no productId on the query
  const resp = await page.request.get(`${BASE}/api/checkout`, { failOnStatusCode: false });
  console.log(`/api/checkout status: ${resp.status()}`);
});

await step('5-hit-api-checkout-with-productid', async () => {
  // with a productId — should fire `checkout_initiated` then either redirect or error
  const resp = await page.request.get(`${BASE}/api/checkout?productId=test`, { failOnStatusCode: false });
  console.log(`/api/checkout?productId=test status: ${resp.status()}`);
});

await step('6-hit-api-start-trial-anon', async () => {
  // POST without auth — should fire `trial_start_attempt` then `trial_start_blocked("not_authenticated")`
  const resp = await page.request.post(`${BASE}/api/billing/start-trial`, { failOnStatusCode: false });
  console.log(`/api/billing/start-trial status: ${resp.status()}`);
});

await browser.close();

const report = {
  base: BASE,
  startedAt: events[0]?.tsBefore,
  endedAt: events[events.length - 1]?.tsAfter,
  steps: events,
  gaHitsCount: gaHits.length,
  gaHits: gaHits.slice(0, 50),
  serverApiHitsCount: serverApiHits.length,
  serverApiHits,
  consoleLinesCount: consoleLines.length,
  consoleLines: consoleLines.slice(0, 100),
};
writeFileSync('/tmp/lea6-walkthrough-report.json', JSON.stringify(report, null, 2));
console.log('\n=== REPORT ===');
console.log(JSON.stringify({ gaHitsCount: report.gaHitsCount, serverApiHitsCount: report.serverApiHitsCount, steps: events.length }, null, 2));
