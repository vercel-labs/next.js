import { chromium } from 'playwright';
import fs from 'fs';
const ART='./artifacts';
fs.mkdirSync(ART,{recursive:true});
const LOG=process.env.LOG||'dev.log';
const countFav=()=> (fs.readFileSync(LOG,'utf8').match(/GET \/favicon\.ico/g)||[]).length;
const b=await chromium.launch({headless:false, args:['--disk-cache-size=1','--disable-application-cache','--media-cache-size=1']});
const page=await (await b.newContext()).newPage();
await page.addInitScript(()=>{
  window.__iconOps=[];
  new MutationObserver(ms=>{for(const m of ms){
    for(const n of m.addedNodes) if(n.tagName==='LINK'&&/icon/i.test(n.getAttribute('rel')||'')) window.__iconOps.push(['add',n.getAttribute('href'),Date.now()]);
    for(const n of m.removedNodes) if(n.tagName==='LINK'&&/icon/i.test(n.getAttribute('rel')||'')) window.__iconOps.push(['remove',n.getAttribute('href'),Date.now()]);
  }}).observe(document,{childList:true,subtree:true});
});
await page.goto('http://localhost:3000/',{waitUntil:'networkidle'});
await page.waitForTimeout(3000);
let prevOps=await page.evaluate(()=>window.__iconOps.length), prevFav=countFav();
console.log(`initial: iconOps=${prevOps} serverFaviconGETs=${prevFav}`);
const rounds=Number(process.env.ROUNDS||5), burst=Number(process.env.BURST||1);
for(let i=1;i<=rounds;i++){
  for(let j=0;j<burst;j++){
    fs.writeFileSync('app/page.js',`export default function Page() {\n  return <main><h1>hello ${i}-${j}</h1></main>;\n}\n`);
    if(burst>1) await page.waitForTimeout(300);
  }
  await page.waitForFunction(t=>document.querySelector('h1')?.textContent===t,`hello ${i}-${burst-1}`,{timeout:30000}).catch(()=>console.log('  hmr wait failed'));
  await page.waitForTimeout(4000);
  const ops=await page.evaluate(()=>window.__iconOps.length), fav=countFav();
  console.log(`round ${i} (burst ${burst}): iconOps=+${ops-prevOps} serverFaviconGETs=+${fav-prevFav}`);
  prevOps=ops; prevFav=fav;
}
fs.writeFileSync(`${ART}/icon-ops-${process.env.TAG||'x'}.json`,JSON.stringify(await page.evaluate(()=>window.__iconOps),null,2));
await page.screenshot({path:`${ART}/page-${process.env.TAG||'x'}.png`});
await b.close();
