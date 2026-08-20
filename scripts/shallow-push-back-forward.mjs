import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true });
const p = await b.newPage();
const reqs = [];
p.on('request', r => { if (r.url().includes('/_next/data/')) reqs.push(r.url().replace(/.*_next\/data\/[^/]+/,'')); });
let last=null;
const snap = async (l) => { await p.waitForTimeout(1200); const h=Number((await p.locator('#hits').textContent()).replace(/\D/g,'')); const tag = last===null?'':(h!==last?'GSSP RAN':'!! GSSP DID NOT RUN'); last=h; console.log(l.padEnd(26), p.url().replace('http://localhost:3000',''), '| hits:', h, tag, '| fetches:', reqs.length); };
await p.goto('http://localhost:3000/categories/women/ready-to-wear.html?style=push');
await snap('SSR');
await p.click('#shallow'); await p.waitForFunction(()=>location.search.includes('page=2')); await snap('shallow PUSH page=2');
await p.click('#shallow'); await p.waitForFunction(()=>location.search.includes('page=3')); await snap('shallow PUSH page=3');
await p.click('#go-women\\.html'); await p.waitForFunction(()=>location.pathname==='/categories/women.html'); await snap('push women.html');
for (let i=1;i<=3;i++){ await p.goBack(); await snap('BACK '+i); }
for (let i=1;i<=3;i++){ await p.goForward(); await snap('FWD '+i); }
console.log('fetches:\n'+reqs.join('\n'));
await p.screenshot({path:'/workspace/.next-maintainer/reproduction-artifacts/playwright/shallow-push-back.png', fullPage:true});
await b.close();
