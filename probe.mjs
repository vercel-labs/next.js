// Records, on every animation frame, the URL + visible text while the client-side
// navigation to /source (a server component that calls redirect()) happens.
// Usage: node probe.mjs [baseUrl]
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://localhost:3020';
const out = process.env.OUT_DIR || 'artifacts';
const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
await page.goto(base + '/', { waitUntil: 'networkidle' });

await page.evaluate(() => {
  window.__snaps = [];
  const t0 = performance.now();
  const tick = () => {
    window.__snaps.push([
      Math.round(performance.now() - t0),
      location.pathname,
      (document.getElementById('content')?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 80),
      document.body.innerHTML.replace(/\s+/g, ' ').slice(0, 300),
    ]);
    if (performance.now() - t0 < 6000) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});

await page.click('#to-source');
await page.waitForTimeout(3000);

const snaps = await page.evaluate(() => window.__snaps);
const collapsed = [];
for (const s of snaps) {
  const l = collapsed[collapsed.length - 1];
  if (!l || l[1] !== s[1] || l[2] !== s[2]) collapsed.push(s);
}
console.log('frame timeline (ms, pathname, visible text of #content):');
for (const [t, p, txt] of collapsed) console.log(`${String(t).padStart(5)}  ${p.padEnd(10)}  ${JSON.stringify(txt)}`);
const blankFrame = collapsed.find((s) => s[1] === '/source' && s[2] === '');
if (blankFrame) console.log('\nDOM painted during the blank frame:\n' + blankFrame[3]);
console.log(blankFrame ? '\nBUG: blank UI painted at /source before /target rendered' : '\nNo blank frame observed');
await page.screenshot({ path: out + '/final.png' });
await ctx.close();
await browser.close();
