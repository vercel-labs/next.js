const { chromium } = require('playwright')
const head = p => p.evaluate(() => [...document.head.children].map(e => e.outerHTML).filter(h=>/^<(meta|title)/.test(h)))
;(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto(process.argv[2] || 'http://localhost:3000',{waitUntil:'networkidle'});
console.log('AFTER HYDRATION:'); console.log((await head(p)).join('\n'));
await p.click('a'); await p.waitForTimeout(800);
console.log('AFTER NAV:'); console.log((await head(p)).join('\n'));
await b.close()})()
