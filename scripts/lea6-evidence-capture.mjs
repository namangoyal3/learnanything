import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
await page.goto('https://learnanything.pro/pricing', { waitUntil: 'networkidle', timeout: 30000 });
await page.screenshot({ path: '/tmp/lea6-pricing-prod.png', fullPage: false });
await browser.close();
console.log('saved /tmp/lea6-pricing-prod.png');
