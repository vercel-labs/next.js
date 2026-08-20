import { chromium } from 'playwright';
const BASE = process.env.BASE || 'http://localhost:3000';
const OUT = process.env.OUT || '.';
const TAG = process.env.TAG || 'repro';
const b = await chromium.launch({ headless: true });
const page = await b.newPage();
const reqs = [];
page.on('request', r => { if (r.url().includes('dashboard')) reqs.push(r.method()+' '+r.url()+' rsc='+!!r.headers()['rsc']); });
const log = [];
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.click('a[href="/dashboard"]'); await page.waitForTimeout(1200);
log.push('logged-out -> ' + page.url());
await page.click('#signin'); await page.waitForTimeout(1500);
log.push('after login -> ' + page.url());
for (const wait of [0, 15000, 40000]) {
  await page.waitForTimeout(wait);
  await page.click('a[href="/dashboard"]'); await page.waitForTimeout(1200);
  const t = (await page.locator('body').innerText()).replace(/\n/g,'|');
  log.push(`client-nav to /dashboard after +${wait/1000}s -> url=${page.url()} text=${t}`);
  await page.screenshot({ path: `${OUT}/${TAG}-plus${wait/1000}s.png` });
  await page.click('a[href="/"]'); await page.waitForTimeout(800);
}
log.push('dashboard-related network requests:\n  ' + reqs.join('\n  '));
console.log(log.join('\n'));
await b.close();
