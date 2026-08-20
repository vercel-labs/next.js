import { chromium } from 'playwright';

const OUT = './artifacts';
const browser = await chromium.launch();
const page = await browser.newPage();
const logs = [];
page.on('console', (m) => logs.push(`[console.${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
page.on('requestfailed', (r) => logs.push(`[requestfailed] ${r.url()} ${r.failure()?.errorText}`));
page.on('request', (r) => { if (r.url().includes('_rsc')) logs.push(`[rsc-req] ${r.url()} hdrs=${JSON.stringify(r.headers())}`); });

// Scenario A: direct navigation to unicode query URL, then hover links
await page.goto('http://localhost:3000/search?name=%E3%84%B1%E3%84%B4%E3%84%B7%E3%84%B9', { waitUntil: 'load' });
await page.waitForTimeout(2000);
logs.push('--- hovering Home ---');
await page.getByRole('link', { name: 'Home' }).hover();
await page.waitForTimeout(1500);
logs.push('--- hovering Search ---');
await page.getByRole('link', { name: 'Search' }).hover();
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/scenarioA-direct-unicode-url.png`, fullPage: true });

logs.push('=== Scenario B: navigate from / -> Search -> Move1 -> hover ===');
await page.goto('http://localhost:3000/', { waitUntil: 'load' });
await page.waitForTimeout(1500);
await page.getByRole('link', { name: 'Search' }).click();
await page.waitForTimeout(2000);
await page.getByRole('button', { name: 'Move1' }).click();
await page.waitForTimeout(1500);
logs.push(`url after Move1: ${page.url()}`);
await page.getByRole('link', { name: 'Home' }).hover();
await page.waitForTimeout(1500);
await page.getByRole('link', { name: 'Search' }).hover();
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/scenarioB-router-push-unicode.png`, fullPage: true });

console.log(logs.join('\n'));
await browser.close();
