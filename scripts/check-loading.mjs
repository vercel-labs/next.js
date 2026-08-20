// Automated check for https://github.com/vercel/next.js/issues/56344
// Starts nothing: point BASE at a running dev/prod server, e.g.
//   BASE=http://localhost:3000 TAG=canary node scripts/check-loading.mjs
// Every navigation is throttled by 1200ms so the loading boundary that the
// router renders while fetching the RSC payload is observable.
import { chromium } from 'playwright';
const base = process.env.BASE || 'http://localhost:3000';
const TAG = process.env.TAG || 'next';
const browser = await chromium.launch();
const page = await (await browser.newContext()).newPage();
// warm the dev compiler / route cache
for (const u of ['/blog', '/blog/warm', '/c/us', '/c/us/ca', '/c/us/ca/sf'])
  await page.goto(base + u, { waitUntil: 'networkidle' });

let failures = 0;
async function run(from, to, expected) {
  await page.goto(base + from, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.route('**/*', async (r) => {
    await new Promise((x) => setTimeout(x, 1200));
    await r.continue().catch(() => {});
  });
  await page.evaluate(() => {
    window.__seq = [];
    const rec = () => {
      const l = [...document.querySelectorAll('[data-loading]')]
        .map((e) => e.getAttribute('data-loading'))
        .join('+');
      if (l && window.__seq.at(-1) !== l) window.__seq.push(l);
    };
    new MutationObserver(rec).observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
    });
    window.__ri = setInterval(rec, 10);
  });
  await page.evaluate((u) => window.next.router.push(u), to);
  await page.waitForTimeout(4500);
  const seq = await page.evaluate(() => {
    clearInterval(window.__ri);
    return window.__seq;
  });
  const ok = seq.length === 1 && seq[0] === expected;
  if (!ok) failures++;
  console.log(
    `${ok ? 'PASS' : 'FAIL'} [${TAG}] ${from} -> ${to} : loading boundaries shown ${JSON.stringify(seq)} (expected only ["${expected}"])`
  );
  await page.unrouteAll();
}
await run('/', '/blog/x', 'slug');
await run('/blog', '/blog/x', 'slug');
await run('/', '/c/us/ca/sf', 'city');
await run('/c/us', '/c/us/ca/sf', 'city');
await run('/c/us/ca/sf', '/c/us', 'country');
await browser.close();
console.log(failures ? `\n${failures} navigation(s) rendered a parent loading.tsx (bug reproduced)` : '\nAll navigations rendered only the leaf loading.tsx (no bug)');
process.exit(0);
