import { chromium } from 'playwright'
const port = process.argv[2] || 3001
const b = await chromium.launch()
const p = await (await b.newContext({viewport:{width:800,height:400}})).newPage()
await p.goto(`http://localhost:${port}/a`, { waitUntil: 'networkidle' })
await p.waitForTimeout(1500)
await p.evaluate(() => { window.__frames.length = 0 })
for (let i=0;i<4;i++) {
  await p.click('a'); await p.waitForTimeout(1000)
}
const frames = await p.evaluate(() => window.__frames)
const states = {}
for (const f of frames) { const k = 'el='+f.elBg+' sheets='+f.sheets; states[k]=(states[k]||0)+1 }
console.log('port', port, 'frames', frames.length, states)
await b.close()
