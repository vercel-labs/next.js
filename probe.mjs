// Loads both routes in Chromium and prints which client modules actually
// get evaluated in the browser. Run `next build && next start -p 3000` first.
import { chromium } from 'playwright';

const port = process.env.PORT || 3000;
const b = await chromium.launch();
for (const route of ['/server-cond', '/client-cond']) {
  const ctx = await b.newContext();
  const p = await ctx.newPage();
  const logs = [];
  const scripts = [];
  p.on('console', (m) => logs.push(m.text()));
  p.on('request', (r) => {
    if (r.resourceType() === 'script') scripts.push(r.url().split('/_next/static/')[1] || r.url());
  });
  await p.goto(`http://localhost:${port}${route}`, { waitUntil: 'load' });
  await p.waitForTimeout(2500);
  console.log(`### ${route}`);
  console.log('  scripts:', scripts.join(', '));
  console.log('  console:', JSON.stringify(logs));
  await ctx.close();
}
await b.close();
