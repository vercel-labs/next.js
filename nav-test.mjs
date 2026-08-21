// Detects hard reload vs soft navigation by checking whether a JS marker
// survives clicking <Link href="/test">.
import { chromium } from 'playwright';
const BASE = process.env.BASE_URL || 'http://localhost:3000';
const b = await chromium.launch();
async function run(path, label) {
  const ctx = await b.newContext();
  const p = await ctx.newPage();
  const loads = [];
  p.on('load', () => loads.push(p.url()));
  await p.goto(BASE + path, { waitUntil: 'networkidle' });
  await p.evaluate(() => { window.__marker = 'kept'; });
  await p.click('a[href="/test"]');
  await p.waitForFunction(() => document.body.innerText.includes('Test'), null, { timeout: 15000 }).catch(() => {});
  await p.waitForTimeout(1500);
  const marker = await p.evaluate(() => window.__marker ?? null);
  console.log(JSON.stringify({ label, url: p.url(), navigation: marker === 'kept' ? 'SOFT' : 'HARD', loadEvents: loads }));
  await ctx.close();
}
await run('/', "import Link from 'next/link.js'");
await run('/control', "import Link from 'next/link' (control)");
await b.close();
