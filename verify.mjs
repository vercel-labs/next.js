// Usage: node verify.mjs [baseUrl]  (default http://localhost:3000)
// Loads /docs/en, hovers + clicks each <Link>, logs every /_next/data request.
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://localhost:3000';
const browser = await chromium.launch();
const page = await (await browser.newContext()).newPage();

page.on('response', async (r) => {
  const u = r.url();
  if (!u.includes('_next/data')) return;
  let body = '';
  try {
    body = (await r.text()).slice(0, 100);
  } catch {}
  console.log(
    'DATA',
    r.status(),
    u.replace(base, ''),
    r.headers()['content-type'],
    '|',
    body.replace(/\s+/g, ' ')
  );
});
page.on('pageerror', (e) => console.log('PAGEERROR', e.message));

for (const sel of ['#to-ssg', '#to-post', '#to-ssr']) {
  await page.goto(base + '/docs/en', { waitUntil: 'networkidle' });
  await page.hover(sel);
  await page.waitForTimeout(1500);
  await page.click(sel);
  await page.waitForTimeout(2500);
  console.log(
    sel,
    '-> url:',
    page.url().replace(base, ''),
    '| h1:',
    await page.textContent('h1').catch(() => 'MISSING'),
    '| props:',
    await page.textContent('#props').catch(() => 'MISSING')
  );
}

// Raw data-route probe for an automatically-static page (issue root cause claim)
const buildId = await page.evaluate(() => window.__NEXT_DATA__.buildId);
const res = await page.request.get(`${base}/docs/_next/data/${buildId}/en.json`);
console.log(
  'raw /en.json ->',
  res.status(),
  res.headers()['content-type'],
  (await res.text()).slice(0, 60)
);

await browser.close();
