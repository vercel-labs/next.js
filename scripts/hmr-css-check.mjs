import { chromium } from 'playwright';
import fs from 'fs';

const CSS = new URL('../app/globals.css', import.meta.url).pathname;
const N = Number(process.env.N || 8);
const base = fs.readFileSync(CSS, 'utf8').replace(/\nh1 \{[\s\S]*$/, '');

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:3000/', { waitUntil: 'load' });
await page.waitForTimeout(3000);

const colorOf = () => page.evaluate(() => getComputedStyle(document.querySelector('h1')).color);

for (let i = 1; i <= N; i++) {
  const r = 100 + i, g = 3 * i, b = 5 * i;
  const want = `rgb(${r}, ${g}, ${b})`;
  const token = `rgb(${r} ${g} ${b})`;
  fs.writeFileSync(CSS, `${base}\nh1 {\n  color: ${token} !important;\n}\n`);
  const t0 = Date.now();
  let got;
  while (Date.now() - t0 < 8000) {
    got = await colorOf();
    if (got === want) break;
    await page.waitForTimeout(150);
  }
  if (got === want) { console.log(`${i} OK in ${Date.now() - t0}ms`); }
  else {
    console.log(`${i} STALE: dom=${got} want=${want}`);
    // what does the server serve right now?
    const served = await page.evaluate(async () => {
      const hrefs = [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => l.href);
      const out = [];
      for (const h of hrefs) {
        const t = await (await fetch(h, { cache: 'reload' })).text();
        const m = t.match(/h1\s*\{[^}]*\}/);
        out.push({ h, rule: m && m[0] });
      }
      return out;
    });
    console.log('   served CSS:', JSON.stringify(served));
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(2000);
    console.log(`   after F5: ${await colorOf()}`);
    // touch file again with identical content
    fs.writeFileSync(CSS, `${base}\nh1 {\n  color: ${token} !important;\n}\n`);
    await page.waitForTimeout(3000);
    console.log(`   after rewriting same content: ${await colorOf()}`);
  }
  await page.waitForTimeout(600);
}
await page.screenshot({ path: 'final-state.png' });
await browser.close();
