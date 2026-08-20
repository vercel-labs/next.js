import { chromium } from 'playwright';
const base = process.env.BASE || 'http://localhost:3000';
const budget = Number(process.env.BUDGET||180)*1000;
const start=Date.now();
const browser = await chromium.launch({ headless: process.env.HEADED?false:true, args:['--disable-features=BackForwardCache'] });
const ctx = await browser.newContext();
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
let n=0, hits=0, max=0;
while (Date.now()-start < budget) {
  n++;
  const cpu = 1 + Math.floor(Math.random()*20);
  const d = Math.floor(Math.random()*250);
  const lat = Math.random()<0.5 ? 60 : 0;
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
  await page.goto(base + '/en/red', {waitUntil:'load'});
  const box = await page.getByRole('link',{name:'Blue'}).boundingBox();
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
  if (lat) await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:lat,downloadThroughput:1.5*1024*1024/8,uploadThroughput:750*1024/8});
  await page.reload({waitUntil:'commit'});
  const t0=Date.now();
  while (Date.now()-t0 < d) await new Promise(r=>setTimeout(r,1));
  await page.evaluate(()=>{window.__mark=1}).catch(()=>{});
  await page.mouse.click(box.x+box.width/2, box.y+box.height/2);
  const tclick=Date.now();
  let ok=false;
  try { await page.waitForFunction(() => document.body.innerText.includes('Blue is the best'), null, { timeout: 8000, polling: 50 }); ok=true; } catch(e){}
  const dur = Date.now()-tclick;
  const sameDoc = await page.evaluate(()=>window.__mark===1).catch(()=>null);
  if (dur>max) max=dur;
  if (!ok || dur>3000) { hits++; console.log(`HIT trial=${n} cpu=${cpu} delay=${d} lat=${lat} ok=${ok} dur=${dur} sameDoc=${sameDoc} url=${page.url()}`); 
    if(!ok){ // wait longer to measure full delay
      try { await page.waitForFunction(() => document.body.innerText.includes('Blue is the best'), null, { timeout: 70000, polling: 200 }); console.log(`  resolved after ${Date.now()-tclick}ms`);} catch(e){ console.log('  still not resolved after 78s'); }
    }
  }
}
console.log(`trials=${n} hits=${hits} maxDur=${max}`);
await browser.close();
