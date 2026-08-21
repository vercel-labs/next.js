import { chromium } from 'playwright';
const PORT = process.env.PORT || 3001;
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright';
const b = await chromium.launch();
const p = await b.newPage();
await p.goto(`http://localhost:${PORT}/search`);
await p.waitForSelector('#link-a');
await p.click('#link-a');
await p.waitForSelector('text=Detail Page a');
const t0 = Date.now();
const samples = [];
await p.goBack({ waitUntil: 'commit' }).catch(()=>{});
let urlAt=null, contentAt=null, shot=false;
while (Date.now()-t0 < 12000) {
  const url = p.url();
  const title = await p.textContent('#page-title').catch(()=>null);
  const t = Date.now()-t0;
  samples.push([t, url.replace(`http://localhost:${PORT}`,''), title]);
  if (urlAt===null && url.includes('/search')) urlAt = t;
  if (urlAt!==null && !shot && t>urlAt+400) { await p.screenshot({path:`${OUT}/pages-router-back-stale-${process.env.TAG||'15.4.3'}.png`}); shot=true; }
  if (title && title.includes('Search')) { contentAt = t; break; }
  await p.waitForTimeout(100);
}
console.log(JSON.stringify({version: process.env.TAG, urlAt, contentAt, staleMs: contentAt-urlAt}));
console.log(samples.filter((s,i)=>i%5===0 || i<6).map(s=>s.join(' | ')).join('\n'));
await b.close();
