import { chromium } from 'playwright';
const port = process.argv[2] || 3000;
const scenario = process.argv[3] || 'A';
const style = process.argv[4] || '';
const b = await chromium.launch({ headless: true });
const p = await b.newPage();
const reqs = [];
p.on('request', r => { if (r.url().includes('/_next/data/')) reqs.push(r.url()); });
let lastHits = null;
async function snap(label) {
  await p.waitForTimeout(1000);
  const hits = Number((await p.locator('#hits').textContent()).replace(/\D/g, ''));
  const changed = lastHits === null ? 'n/a' : (hits !== lastHits ? 'GSSP RAN' : '!! GSSP DID NOT RUN');
  console.log(`${label.padEnd(34)} url=${p.url().replace(`http://localhost:${port}`,'').padEnd(42)} hits=${hits} ${changed}`);
  lastHits = hits;
}
const go = async (slug) => { await p.click(`#go-${slug.replace(/\./g,'\\.').replace(/\//g,'\\/')}`); await p.waitForFunction(s => location.pathname === `/categories/${s}`, slug); };
if (scenario === 'A') {
  await p.goto(`http://localhost:${port}/categories/women/ready-to-wear.html${style?`?style=${style}`:''}`); await snap('SSR women/ready-to-wear');
  await p.click('#shallow'); await p.waitForFunction(()=>location.search.includes('page=2')); await snap('shallow ?page=2');
  await go('women.html'); await snap('push women.html');
  await go('women/shoes.html'); await snap('push women/shoes.html');
  for (let i=1;i<=2;i++){ await p.goBack(); await snap(`BACK ${i}`); }
  for (let i=1;i<=2;i++){ await p.goForward(); await snap(`FORWARD ${i}`); }
}
if (scenario === 'B') {
  await p.goto(`http://localhost:${port}/categories/women/ready-to-wear.html${style?`?style=${style}`:''}`); await snap('SSR women/ready-to-wear');
  await go('women.html'); await snap('push women.html');
  await go('women/shoes.html'); await snap('push women/shoes.html');
  for (let i=1;i<=2;i++){ await p.goBack(); await snap(`BACK ${i}`); }
  for (let i=1;i<=2;i++){ await p.goForward(); await snap(`FORWARD ${i}`); }
  await p.goBack(); await snap('BACK again');
}
console.log('total data fetches:', reqs.length);
console.log(reqs.map(r=>r.replace(/.*\/_next\/data\/[^/]+/,'')).join('\n'));
await b.close();
