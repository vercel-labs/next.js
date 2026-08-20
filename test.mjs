import { chromium } from 'playwright';
const base = process.env.BASE || 'http://localhost:3000';
const shots = '/workspace/.next-maintainer/reproduction-artifacts/playwright';
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:900,height:700}})).newPage();
async function run(kind, sel, expectTitle) {
  await p.goto(base + '/');
  await p.waitForLoadState('networkidle');
  await p.evaluate(() => window.scrollTo(0, 3000));
  await p.waitForTimeout(300);
  const before = await p.evaluate(() => window.scrollY);
  await p.click(sel);
  await p.waitForFunction(t => document.getElementById('title')?.textContent === t, expectTitle);
  await p.waitForTimeout(800);
  const after = await p.evaluate(() => window.scrollY);
  await p.screenshot({ path: `${shots}/${process.env.TAG||'x'}-${kind}.png` });
  console.log(`${kind}: scrollY before=${before} after=${after} -> ${after===0?'SCROLLED TO TOP':'DID NOT SCROLL TO TOP'}`);
}
await run('router.push', '#push-a', 'page a');
await run('Link', '#link-a', 'page a');
await b.close();
