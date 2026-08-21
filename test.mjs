import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = process.env.BASE || 'http://localhost:3000';
const ART = process.env.ART || './artifacts';

mkdirSync(ART, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
const rsc = [];
page.on('request', (r) => {
  const u = new URL(r.url());
  if (r.resourceType() === 'document' || u.searchParams.has('_rsc') || r.headers()['rsc']) rsc.push(u.pathname + u.search);
});

async function scenario(label, linkText, expectedPath) {
  rsc.length = 0;
  await page.goto(BASE + '/link1', { waitUntil: 'networkidle' });
  // first navigation (populate router cache)
  await page.getByRole('link', { name: linkText, exact: true }).click();
  await page.getByRole('heading', { name: 'Page 2' }).waitFor();
  const first = rsc.filter((u) => u.startsWith('/link2')).length;
  // back to /link1
  await page.getByRole('link', { name: 'Link 1', exact: true }).click();
  await page.getByRole('link', { name: linkText, exact: true }).waitFor();
  rsc.length = 0;
  // second navigation within 30s dynamic staleTime -> should hit router cache
  const t0 = Date.now();
  await page.getByRole('link', { name: linkText, exact: true }).click();
  await page.getByRole('heading', { name: 'Page 2' }).waitFor();
  const ms = Date.now() - t0;
  const second = rsc.filter((u) => u.startsWith('/link2'));
  await page.screenshot({ path: `${ART}/${label}.png` });
  console.log(
    `${label}: url=${new URL(page.url()).pathname + new URL(page.url()).search} ` +
      `firstNavRscRequests=${first} secondNavRscRequests=${second.length} ` +
      `secondNavMs=${ms} refetched=${second.length > 0} ${JSON.stringify(second)}`
  );
}

await scenario('with-query-param', 'Link 2 - 1', '/link2?q=1');
await scenario('without-query-param', 'Link 2 - 3', '/link2');

await browser.close();
