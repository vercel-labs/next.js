import { chromium } from 'playwright';

const base = process.env.BASE ?? 'http://localhost:3000';
const N = Number(process.env.N ?? 10);
const browser = await chromium.launch();
let hits = 0;

for (let i = 0; i < N; i++) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`${base}/items/missing`);
  await page.waitForTimeout(3000);
  const body = (await page.locator('body').innerText()).replace(/\n+/g, ' | ');
  const hit = errors.some((m) => /310|more hooks/i.test(m));
  if (hit) hits++;
  console.log(`#${i} hooksError=${hit} body=${body.slice(0, 70)}`);
  await ctx.close();
}

console.log(`hits=${hits}/${N}`);
await browser.close();
