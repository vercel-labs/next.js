import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await (await b.newContext({viewport:{width:800,height:400}})).newPage()
await p.goto(`http://localhost:${process.argv[2] || 3000}`, { waitUntil: 'networkidle' })
await p.waitForTimeout(2000)
const css = []
p.on('request', r => { if (/\.css|font/.test(r.url())) css.push(r.url().slice(0,140)) })
await p.evaluate(() => { window.__frames.length = 0 })
for (let i=0;i<5;i++) { await p.click('#refresh'); await p.waitForTimeout(1200) }
const frames = await p.evaluate(() => window.__frames)
const states = {}
for (const f of frames) { const k = f.bodyBg+' | el='+f.elBg+' | font='+f.font+' | sheets='+f.sheets; states[k]=(states[k]||0)+1 }
console.log('frames', frames.length, states)
console.log('css/font requests during refresh:', css)
await b.close()
