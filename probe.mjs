import { chromium } from 'playwright';
const url = process.argv[2] || 'http://localhost:3111/probe';
const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
page.on('console', m => console.log('[console]', m.type(), m.text()));
page.on('pageerror', e => console.log('[pageerror]', e.message));
await page.addInitScript(() => {
  window.__c = { visibility: 0, focus: 0, pointer: 0 };
  document.addEventListener('visibilitychange', () => window.__c.visibility++);
  window.addEventListener('focus', () => window.__c.focus++);
  window.addEventListener('pointerdown', () => window.__c.pointer++, true);
  window.__start = Date.now();
  window.__hydratedAtMs = null;
  window.__polls = 0;
  setInterval(() => {
    window.__polls++;
    if (window.__hydratedAtMs === null) {
      const el = document.querySelector('[data-probe="bit-1"]');
      if (el && Object.keys(el).some(k => k.startsWith('__react'))) {
        window.__hydratedAtMs = Date.now() - window.__start;
      }
    }
  }, 100);
});
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(6000);
const res = await page.evaluate(() => ({
  hydratedAtMs: window.__hydratedAtMs,
  polls: window.__polls,
  counters: window.__c,
  loadingStillPresent: !!document.querySelector('[data-probe="loading"]'),
  buttons: document.querySelectorAll('[data-probe^="bit-"]').length,
  bodyText: document.body.innerText.slice(0, 200),
  visibility: document.visibilityState,
}));
console.log(JSON.stringify(res, null, 2));
await page.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/probe-handsoff.png' });
// now click to see if it wakes
await page.click('[data-probe="bit-1"]').catch(e => console.log('click fail', e.message));
await page.waitForTimeout(1000);
console.log('after click:', JSON.stringify(await page.evaluate(() => ({ hydratedAtMs: window.__hydratedAtMs, text: document.body.innerText.slice(0,100) }))));
await browser.close();
