import { chromium } from 'playwright';
const PORT = process.argv[2] || '3000';
const TAG = process.argv[3] || 'canary';
const OUT='/workspace/.next-maintainer/reproduction-artifacts/playwright';
const b = await chromium.launch();
const ctx = await b.newContext();
// realistic long session cookie (browsers send this on every request)
await ctx.addCookies([1,2,3].map(i=>({name:'session'+i, value:'c'.repeat(3800), url:`http://localhost:${PORT}`})));
const p = await ctx.newPage();
p.on('request', r=>{const h=r.headers();const s=Object.entries(h).reduce((a,[k,v])=>a+k.length+v.length+4,0)+r.url().length; if(r.url().includes('dashboard')) console.log(`REQ approxHeaderBytes=${s}`)});
p.on('response', r=>{ if(r.url().includes('dashboard')) console.log('RES status='+r.status()+' text='+r.statusText())});
const resp = await p.goto(`http://localhost:${PORT}/dashboard?auth_token=`+'a'.repeat(7830), {waitUntil:'load'}).catch(e=>({e:String(e)}));
console.log('nav status:', resp?.status?.() ?? JSON.stringify(resp));
console.log('body:', (await p.locator('body').innerText()).slice(0,300).replace(/\n/g,' | '));
await p.screenshot({path:`${OUT}/${TAG}-431.png`, fullPage:true});
await b.close();
