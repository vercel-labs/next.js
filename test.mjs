import { chromium } from 'playwright';
const OUT='/workspace/.next-maintainer/reproduction-artifacts/playwright';
const b = await chromium.launch();
async function run(nav, label){
  const p = await (await b.newContext()).newPage();
  const log = [];
  const t0 = Date.now();
  if (nav === 'hard') { await p.goto('http://localhost:3000'+label.path, {waitUntil:'commit'}); }
  else { await p.goto('http://localhost:3000/'); await p.click(label.link); }
  let fb=null, data=null;
  const start = Date.now();
  const poll = setInterval(async()=>{}, 10);
  while (Date.now()-start < 12000) {
    const h = await p.content().catch(()=>'' );
    if (!fb && h.includes('LOADING FALLBACK')) fb = Date.now()-start;
    if (!data && h.includes('SLOW DATA LOADED:')) { data = Date.now()-start; break; }
    await new Promise(r=>setTimeout(r,50));
  }
  clearInterval(poll);
  await p.screenshot({path:`${OUT}/${nav}-${label.name}.png`});
  console.log(JSON.stringify({nav, route:label.name, fallbackVisibleAtMs:fb, dataAtMs:data}));
  await p.close();
}
const nested={name:'post-nested-dynamic', path:'/post/1', link:'#to-post'};
const flat={name:'flat-toplevel', path:'/flat', link:'#to-flat'};
await run('hard', nested); await run('hard', flat);
await run('soft', nested); await run('soft', flat);
await b.close();
