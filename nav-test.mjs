import { chromium } from 'playwright';
const base = process.argv[2], path = process.argv[3], linkId = process.argv[4]||'no-prefetch', tag=process.argv[5]||'t';
const b = await chromium.launch();
const p = await (await b.newContext()).newPage();
const docReqs=[]; p.on('request', r=>{if(r.resourceType()==='document') docReqs.push(r.url())});
await p.goto(base+path,{waitUntil:'networkidle'});
await p.evaluate(()=>{window.__m=true});
docReqs.length=0;
const snaps=[];
const t0=Date.now();
await p.click('#'+linkId);
for (let i=0;i<60;i++){
  let txt=null, m=null;
  try { txt = await p.evaluate(()=>document.body.innerText.replace(/\n/g,'|')); m = await p.evaluate(()=>window.__m===true);} catch(e){ txt='<navigating>'; }
  snaps.push(`${Date.now()-t0}ms marker=${m} ${txt}`);
  if (txt && txt.includes('control')) break;
  await new Promise(r=>setTimeout(r,80));
}
await p.screenshot({path:`/workspace/.next-maintainer/reproduction-artifacts/playwright/${tag}.png`});
console.log(snaps.filter((s,i)=>i<3||i>snaps.length-3||s.includes('Loading')).join('\n'));
console.log('docReqsAfterClick:',JSON.stringify(docReqs));
console.log('anyLoading:', snaps.some(s=>s.includes('Loading')));
await b.close();
