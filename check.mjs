import { chromium } from 'playwright';
const base = process.argv[2], label = process.argv[3], order = process.argv[4].split(',');
const b = await chromium.launch();
for (const sc of order) {
  const ctx = await b.newContext();
  const p = await ctx.newPage();
  await p.goto(base + '/ri/home', { waitUntil: 'networkidle' });
  if (sc === 'B') { await p.click('#link-payment'); await p.waitForTimeout(1200); }
  await p.click('#link-progress'); await p.waitForTimeout(1200);
  console.log(`[${label}] scenario${sc} modal=${await p.locator('#modal-progress').count()} full=${await p.locator('#full-progress').count()}`);
  await ctx.close();
}
await b.close();
