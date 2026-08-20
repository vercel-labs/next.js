import { chromium } from 'playwright';
const AD = '/workspace/.next-maintainer/reproduction-artifacts/playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: {width:390,height:844}, isMobile:true, hasTouch:true, userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' , recordVideo:{dir:AD+'/video'}});
const p = await ctx.newPage();
const log=[];
async function sample(tag, ms){
  const t0=Date.now();
  while(Date.now()-t0<ms){
    const s = await p.evaluate(()=>({u:location.pathname,h:document.querySelector('#page')?.textContent||null,items:[...document.querySelectorAll('li a')].map(a=>a.textContent).join(',')}));
    log.push({tag,t:Date.now()-t0,...s});
    await new Promise(r=>setTimeout(r,50));
  }
}
await p.goto('http://localhost:3000/');
await p.click('a');
await p.waitForSelector('li');
await p.waitForTimeout(300);
console.log('--- history.back()');
await p.evaluate(()=>history.back());
await sample('back', 1600);
await p.waitForTimeout(300);
console.log('--- history.forward()');
await p.evaluate(()=>history.forward());
await sample('forward', 1800);
for(const l of log) console.log(l.tag, l.t+'ms', 'url='+l.u, 'h='+JSON.stringify(l.h), 'items='+l.items);
await p.screenshot({path:AD+'/after-forward.png'});
await ctx.close(); await b.close();
