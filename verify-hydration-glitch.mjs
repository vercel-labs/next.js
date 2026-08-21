// Automated reproduction of vercel/next.js#85782
// Types into an SSR'd <input> before React hydration finishes and asserts the value survives.
// Usage: npm run build && npm start   (in another shell)
//        node verify-hydration-glitch.mjs [url] [selector]
import { chromium } from 'playwright';

const url = process.argv[2] || 'http://localhost:3000/app-router-test';
const sel = process.argv[3] || '#app-test-input';

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send('Network.enable');
// High latency (not just low bandwidth) is what exposes the glitch, per the issue thread.
await cdp.send('Network.emulateNetworkConditions', {
  offline: false, latency: 400,
  downloadThroughput: (500 * 1024) / 8, uploadThroughput: (500 * 1024) / 8,
});

const scripts = [];
page.on('response', (r) => { if (r.url().endsWith('.js')) scripts.push([Date.now(), r.url()]); });
page.on('console', (m) => console.log('[console]', m.type(), m.text().slice(0, 120)));

const t0 = Date.now();
await page.goto(url, { waitUntil: 'commit' });
await page.waitForSelector(sel, { state: 'attached', timeout: 30000 });
await page.click(sel);
await page.type(sel, 'hello-before-hydration', { delay: 20 });
const valueAfterTyping = await page.$eval(sel, (e) => e.value);
console.log(`typed at +${Date.now() - t0}ms, value right after typing: ${JSON.stringify(valueAfterTyping)}`);
await page.screenshot({ path: '01-after-typing.png' });

await page.waitForFunction(() => document.body.innerText.includes('Complete'), { timeout: 90000 });
await page.waitForTimeout(1500);
const valueAfterHydration = await page.$eval(sel, (e) => e.value);
console.log(`hydrated at +${Date.now() - t0}ms, value after hydration: ${JSON.stringify(valueAfterHydration)}`);
await page.screenshot({ path: '02-after-hydration.png' });

const base = scripts[0]?.[0] ?? 0;
console.log('script load order:');
for (const [t, u] of scripts) console.log(`  +${t - base}ms ${u.replace(/^https?:\/\/[^/]+/, '')}`);
await browser.close();

const lost = valueAfterTyping !== valueAfterHydration;
console.log(lost ? 'FAIL: pre-hydration input was wiped by hydration' : 'PASS: input survived hydration');
process.exit(lost ? 1 : 0);
