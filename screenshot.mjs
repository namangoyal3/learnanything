import { chromium } from 'playwright';

const browser = await chromium.launch();
const context = await browser.newContext();
await context.addCookies([{name:'token',value:'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJjbW16ZGUwdngwMDAwM3IyZzdsZm01dXNoIiwiZXhwIjoxNzc2OTg0NDkyfQ.q70yRMHZ3sIJ8MX9sfV_G17HLchbzaMdF48Z52DzSDY',domain:'localhost',path:'/',httpOnly:true,secure:false}]);
const page = await context.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:3002/dashboard', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(3000);
await page.screenshot({ path: '/tmp/dashboard-final.png' });
await browser.close();
console.log('Done');
