import { chromium } from 'playwright';
import fs from 'fs';
const ART='./screenshots';
fs_mkdir();
function fs_mkdir(){ }
const F='./app/@modal/(.)product/[id]/page.jsx';
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));

async function cssHas(page, cls){
  return await page.evaluate((c)=>{
    let found=false;
    for (const s of document.styleSheets){
      let rules; try{rules=s.cssRules}catch(e){continue}
      for (const r of rules){ if(r.cssText && r.cssText.includes(c)) found=true; }
    }
    return found;
  }, cls);
}

const b = await chromium.launch();
const p = await b.newPage();
p.on('console', m=>console.log('[browser]', m.type(), m.text()));
await p.goto('http://localhost:3000/', {waitUntil:'networkidle'});
await p.click('#open');
await p.waitForSelector('#modal');
await sleep(2000);
console.log('URL after intercept:', p.url());
console.log('initial modal class:', await p.getAttribute('#modal','class'));
console.log('initial width:', await p.evaluate(()=>getComputedStyle(document.querySelector('#modal')).width));
console.log('initial bg:', await p.evaluate(()=>getComputedStyle(document.querySelector('#modal')).backgroundColor));
fs.mkdirSync(ART,{recursive:true});
await p.screenshot({path:ART+'/1-before-edit.png'});

// edit
let src = fs.readFileSync(F,'utf8');
src = src.replace('w-full bg-red-500','w-2/12 bg-blue-500');
fs.writeFileSync(F, src);
console.log('--- edited file at', new Date().toISOString());
for (let i=1;i<=8;i++){
  await sleep(2000);
  const cls = await p.getAttribute('#modal','class').catch(()=>null);
  const w = await p.evaluate(()=>{const e=document.querySelector('#modal');return e?getComputedStyle(e).width:null});
  const bg = await p.evaluate(()=>{const e=document.querySelector('#modal');return e?getComputedStyle(e).backgroundColor:null});
  console.log(`t+${i*2}s class=${cls} width=${w} bg=${bg} cssHasW212=${await cssHas(p,'w-2\\\\/12')} cssHasBlue=${await cssHas(p,'bg-blue-500')}`);
}
fs.mkdirSync(ART,{recursive:true});
await p.screenshot({path:ART+'/2-after-edit-hmr.png'});
// hard reload
await p.reload({waitUntil:'networkidle'});
await sleep(1500);
console.log('after reload of intercepted URL: class=', await p.getAttribute('#modal','class').catch(()=>null),
 'width=', await p.evaluate(()=>{const e=document.querySelector('#modal');return e?getComputedStyle(e).width:null}));
// full flow again
await p.goto('http://localhost:3000/',{waitUntil:'networkidle'});
await p.click('#open'); await p.waitForSelector('#modal'); await sleep(1500);
console.log('after fresh navigation: class=', await p.getAttribute('#modal','class'),
 'width=', await p.evaluate(()=>getComputedStyle(document.querySelector('#modal')).width),
 'bg=', await p.evaluate(()=>getComputedStyle(document.querySelector('#modal')).backgroundColor),
 'cssHasBlue=', await cssHas(p,'bg-blue-500'));
fs.mkdirSync(ART,{recursive:true});
await p.screenshot({path:ART+'/3-after-fresh-nav.png'});
await b.close();
