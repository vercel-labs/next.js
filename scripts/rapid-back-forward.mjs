import { chromium } from 'playwright';
const port = process.argv[2] || 3000;
const gap = Number(process.argv[3] || 120);
const iters = Number(process.argv[4] || 12);
const b = await chromium.launch({ headless: true });
const p = await b.newPage();
const reqs = [];
p.on('request', r => { if (r.url().includes('/_next/data/')) reqs.push(r.url()); });
const go = async (slug) => { await p.click(`#go-${slug.replace(/\./g,'\\.').replace(/\//g,'\\/')}`); await p.waitForFunction(s => location.pathname === `/categories/${s}`, slug); await p.waitForTimeout(400); };
await p.goto(`http://localhost:${port}/categories/women/ready-to-wear.html`);
await p.click('#shallow'); await p.waitForFunction(()=>location.search.includes('page=2')); await p.waitForTimeout(300);
await go('women.html');
await go('women/shoes.html');
let bad = 0;
for (let i = 0; i < iters; i++) {
  await p.goBack(); await p.waitForTimeout(gap);
  await p.goBack(); await p.waitForTimeout(gap);
  await p.goForward(); await p.waitForTimeout(gap);
  await p.goForward(); await p.waitForTimeout(1200);
  const urlSlug = decodeURIComponent(new URL(p.url()).pathname.replace('/categories/',''));
  const rendered = (await p.locator('#url').textContent()).replace('url: ','').trim();
  const asPath = (await p.locator('#aspath').textContent()).trim();
  const ok = urlSlug === rendered;
  if (!ok) bad++;
  console.log(`iter ${i} browserURL=${p.url().replace(`http://localhost:${port}`,'')} renderedProps=${rendered} ${asPath} ${ok ? 'ok' : '*** MISMATCH: GSSP props stale ***'}`);
}
console.log('mismatches:', bad, 'data fetches:', reqs.length);
if (bad) await p.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/mismatch.png', fullPage: true });
await b.close();
