import { chromium } from 'playwright';
const base=process.argv[2], tag=process.argv[3];
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:900,height:400}})).newPage();
await p.goto(base+'/',{waitUntil:'networkidle'});
await p.evaluate(()=>{ window.__rec=[]; const push=()=>{const t=document.body.innerText.replace(/\s+/g,' ').replace(/Header|Footer/g,'').trim(); window.__rec.push([Math.round(performance.now()), t.length, t.slice(0,14)||'EMPTY']);};
  new MutationObserver(push).observe(document.body,{subtree:true,childList:true,characterData:true});
  const raf=()=>{push(); requestAnimationFrame(raf);}; requestAnimationFrame(raf); });
await p.click('text=GO TO CHECK');
await p.waitForTimeout(9000);
const rec=await p.evaluate(()=>window.__rec);
let prev=null; const tr=[]; for(const r of rec){ if(r[2]!==prev){tr.push(r);prev=r[2];} }
console.log(tag, JSON.stringify(tr));
await b.close();
