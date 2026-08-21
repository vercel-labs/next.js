import { chromium } from 'playwright';
const base = process.argv[2], label = process.argv[3];
const steps = process.argv[4].split(',');
const b = await chromium.launch();
const p = await b.newPage();
const info = () => p.evaluate(() => ({
  titles: [...document.querySelectorAll('head title')].map(t=>t.textContent),
  desc: document.querySelectorAll('head meta[name="description"]').length,
  ogt: document.querySelectorAll('head meta[property="og:title"]').length,
  url: location.pathname + location.search
}));
await p.goto(base+'/en'); await p.waitForSelector('#to-el');
console.log(label,'| initial /en', JSON.stringify(await info()));
for (const sel of steps) {
  try { await p.click(sel,{timeout:8000}); } catch(e) { console.log(label,'|',sel,'clickfail'); continue; }
  await p.waitForTimeout(1500);
  console.log(label,'|',sel, JSON.stringify(await info()));
}
await p.screenshot({path:`/workspace/.next-maintainer/reproduction-artifacts/playwright/${label}.png`});
await b.close();
