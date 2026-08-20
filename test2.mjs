import { chromium } from 'playwright';
const OUT='/workspace/.next-maintainer/reproduction-artifacts/playwright';
const b = await chromium.launch();
async function run(nav, label){
  const p = await (await b.newContext()).newPage();
  if (nav === 'hard') { p.goto('http://localhost:3000'+label.path, {waitUntil:'commit'}).catch(()=>{}); }
  else { await p.goto('http://localhost:3000/'); p.click(label.link).catch(()=>{}); }
  let fb=null, data=null; const start=Date.now();
  while (Date.now()-start < 12000) {
    const h = await p.content().catch(()=>'');
    if (!fb && h.includes('LOADING FALLBACK')) fb = Date.now()-start;
    if (!data && h.includes('SLOW DATA LOADED:')) { data = Date.now()-start; break; }
    await new Promise(r=>setTimeout(r,50));
  }
  await p.screenshot({path:`${OUT}/${nav}-${label.name}.png`});
  console.log(JSON.stringify({nav, route:label.name, fallbackVisibleAtMs:fb, dataAtMs:data}));
  await p.close();
}
const a={name:'awaited-nested', path:'/awaited/1', link:'#to-awaited'};
const f={name:'awaited-flat', path:'/awaited-flat', link:'#to-awaited-flat'};
await run('hard',a); await run('hard',f); await run('soft',a); await run('soft',f);
await b.close();
