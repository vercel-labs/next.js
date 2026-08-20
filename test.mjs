// Verification harness for https://github.com/vercel/next.js/issues/71365
//
// Usage:
//   npm install
//   npm run build            # next build --webpack (output: "export")
//   npm run serve            # serves ./out on http://localhost:3000
//   BASE=http://localhost:3000 npm test
//
// Each scenario loads a static page and then navigates (router.push or <Link>)
// to a static route that carries query params. A scenario FAILS when the target
// page does not render (no <h1> in the document after the navigation).
import { chromium } from 'playwright';

const base = process.env.BASE || 'http://localhost:3000';
const browser = await chromium.launch();
let failures = 0;

async function scenario(name, start, clicks, { delayTxt = 0, waitBefore = 0 } = {}) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const net = [];
  const errs = [];
  if (delayTxt) {
    await page.route('**/*', async (route) => {
      const req = route.request();
      if (req.url().includes('.txt') || req.method() === 'HEAD') {
        await new Promise((r) => setTimeout(r, delayTxt));
      }
      await route.continue();
    });
  }
  page.on('response', (r) => {
    if (!r.url().includes('/_next/static/')) net.push(`${r.request().method()} ${r.status()} ${r.url().replace(base, '')}`);
  });
  page.on('pageerror', (e) => errs.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(`console: ${m.text()}`); });

  await page.goto(base + start, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('h1');
  if (waitBefore) await page.waitForTimeout(waitBefore);

  const lines = [];
  for (const click of clicks) {
    net.length = 0;
    const before = page.url();
    await page.click('#' + click);
    await page.waitForTimeout(8000);
    const h1 = await page.locator('h1').allTextContents();
    const rendered = h1.length > 0 && page.url() !== before;
    if (!rendered) failures++;
    lines.push(`  click #${click} -> ${page.url().replace(base, '')} ${rendered ? 'RENDERED ' + JSON.stringify(h1) : '*** NOT RENDERED ***'}`);
    lines.push(`    requests: ${JSON.stringify(net)}`);
  }
  console.log(`== ${name} (start ${start})`);
  console.log(lines.join('\n'));
  if (errs.length) console.log(`    errors: ${JSON.stringify(errs.slice(0, 3))}`);
  await ctx.close();
}

// 1. exactly what the issue describes: prefetch("/login/") then push with query
await scenario('push /login/?firstVisit=true after prefetching /login/', '/', ['push-query']);
await scenario('push /login/ (control)', '/', ['push-plain']);
// 2. "initial page load on a static route with params, then link to the same route with other params"
await scenario('/login/?firstVisit=true -> /login/?firstVisit=false', '/login/?firstVisit=true', ['l-same-other']);
await scenario('/login/?firstVisit=true -> /other/?x=1', '/login/?firstVisit=true', ['l-other-q']);
await scenario('/other/?x=9 -> /login/?firstVisit=true', '/other/?x=9', ['l-login-q']);
// 3. dynamic (generateStaticParams) route with query params
await scenario('/post/1/?a=1 -> /post/2/?a=2', '/post/1/?a=1', ['push-post2q']);
// 4. click before the prefetch has finished (slow network)
await scenario('click while prefetch in flight (3s delay on .txt/HEAD)', '/other/?x=9', ['l-login-q'], { delayTxt: 3000 });

await browser.close();
console.log(failures === 0 ? '\nAll scenarios rendered the target page (issue NOT reproduced).' : `\n${failures} scenario(s) did not render (issue reproduced).`);
process.exit(failures === 0 ? 0 : 1);
