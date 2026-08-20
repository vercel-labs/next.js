import { chromium } from 'playwright'
const base = process.env.BASE || 'http://localhost:3001'
const b = await chromium.launch(); const p = await b.newPage()
const reqs = []
p.on('request', r => { if (r.url().startsWith(base)) reqs.push(r.url().replace(base,'')) })
await p.goto(base); await new Promise(r => setTimeout(r, 2000))
async function go(sel, txt) { reqs.length=0; await p.click(sel); await p.waitForFunction(t=>document.querySelector('#page')?.textContent?.startsWith(t), txt); await new Promise(r=>setTimeout(r,1200)); console.log(txt, 'reqs=', JSON.stringify(reqs)) }
for (const i of [1,2]) { await go('#dynamic-link','Dynamic'); await go('#home-link','Home') }
await b.close()
