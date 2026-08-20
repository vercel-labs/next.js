import { chromium } from 'playwright'
const port = process.argv[2]
const b = await chromium.launch()
const ctx = await b.newContext({viewport:{width:800,height:400}, recordVideo:{dir:'./playwright-out/video-'+port}})
const p = await ctx.newPage()
await p.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' })
await p.waitForTimeout(1500)
await p.route('**/*.css*', async route => { await new Promise(r => setTimeout(r, 1500)); await route.continue() })
await p.evaluate(() => { window.__frames.length = 0 })
for (let i=0;i<3;i++) { await p.click('#refresh'); await p.waitForTimeout(2500) }
const fr = await p.evaluate(() => window.__frames)
const s = {}; for (const f of fr) { const k='body='+f.bodyBg+' el='+f.elBg+' sheets='+f.sheets; s[k]=(s[k]||0)+1 }
console.log('port',port,'frames',fr.length,s)
await ctx.close(); await b.close()
