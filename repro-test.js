const { chromium } = require('playwright');
const OUT='/workspace/.next-maintainer/reproduction-artifacts/playwright';
(async()=>{const port=process.env.PORT||3000;const b=await chromium.launch();
const ctx=await b.newContext(); const p=await ctx.newPage();
if(process.env.SLOW) await ctx.route('**/_next/static/chunks/**', async r=>{await new Promise(x=>setTimeout(x,600)); r.continue();});
await p.goto(`http://localhost:${port}/`,{waitUntil:'networkidle'});
await p.waitForTimeout(2500);
const seen=[]; await p.click('#to-art');
for(let i=0;i<60;i++){ let t=''; try{t=(await p.locator('body').innerText()).trim();}catch(e){t='<err>';}
 if(seen[seen.length-1]!==t){seen.push(t); console.log((i*50)+'ms:',JSON.stringify(t));
  if(t.includes('artist page...')) await p.screenshot({path:`${OUT}/wrong-loading-${process.env.TAG||'x'}.png`});}
 await p.waitForTimeout(50);}
await b.close();})();
