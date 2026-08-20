import { chromium } from 'playwright';
const from=+(process.env.FROM||0), to=+(process.env.TO||300), step=+(process.env.STEP||10);
const cpu = Number(process.env.CPU || 1);
const base = process.env.BASE || 'http://localhost:3000';
const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
for (let d=from; d<=to; d+=step) {
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await page.goto(base + '/en/red', {waitUntil:'load'});
  await page.waitForTimeout(200);
  const box = await page.getByRole('link',{name:'Blue'}).boundingBox();
  await page.mouse.move(box.x+box.width/2, box.y+box.height/2 - 40);
  if (cpu>1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
  const reqs=[];
  const onreq = r => { if (r.url().includes('/en/blue')) reqs.push([r.resourceType(), Date.now()]); };
  page.on('request', onreq);
  const rp = page.reload({ waitUntil: 'commit' });
  await rp;
  const t0=Date.now();
  while (Date.now()-t0 < d) await new Promise(r=>setTimeout(r,2));
  await page.evaluate(()=>{window.__mark=1}).catch(()=>{});
  await page.mouse.click(box.x+box.width/2, box.y+box.height/2);
  const tclick=Date.now();
  let visible=null;
  try { await page.waitForFunction(() => document.body.innerText.includes('Blue is the best'), null, { timeout: 65000, polling: 100 }); visible=Date.now(); } catch(e){}
  const sameDoc = await page.evaluate(()=>window.__mark===1).catch(()=>null);
  console.log(`cpu=${cpu} reload+click@${d} blue=${visible?(visible-tclick)+'ms':'TIMEOUT>65s'} sameDoc=${sameDoc} url=${page.url()} reqs=${JSON.stringify(reqs.map(([ty,t])=>[ty,t-tclick]))}`);
  page.off('request', onreq);
}
await browser.close();
