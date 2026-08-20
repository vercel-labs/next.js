import { chromium } from 'playwright';
const base = process.env.BASE || 'http://localhost:3000';
const b = await chromium.launch();
const p = await (await b.newContext()).newPage();
await p.goto(base);
const [resp] = await Promise.all([
  p.waitForResponse(r => r.request().method() === 'POST'),
  p.click('#run'),
]);
const headers = await resp.headersArray();
console.log('POST', resp.url(), resp.status());
for (const h of headers) {
  if (/cookie/i.test(h.name)) console.log(`${h.name}: ${h.value}`);
}
console.log('--- document cookies after action ---');
console.log(await p.evaluate(() => document.cookie));
await p.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/after-action.png' });
await b.close();
