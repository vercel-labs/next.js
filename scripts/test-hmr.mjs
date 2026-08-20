import { chromium } from 'playwright'
import fs from 'fs'
const OUT = './playwright-out'
const PAGE = 'app/page.js'
const b = await chromium.launch()
const ctx = await b.newContext({ viewport: {width:800,height:400} })
const p = await ctx.newPage()
await p.goto(`http://localhost:${process.argv[2] || 3000}`, { waitUntil: 'networkidle' })
await p.waitForTimeout(2000)
const src = fs.readFileSync(PAGE, 'utf8')
for (const word of ['Girisw','Girisww','Girisx']) {
  await p.evaluate(() => { window.__frames.length = 0 })
  fs.writeFileSync(PAGE, src.replace('Giris', word))
  await p.waitForFunction(w => document.body.innerText.includes(w), word, { timeout: 15000 }).catch(()=>console.log('no hmr for', word))
  await p.waitForTimeout(2000)
  const frames = await p.evaluate(() => window.__frames)
  const states = {}
  for (const f of frames) { const k = f.bodyBg+' | el='+f.elBg+' | font='+f.font+' | sheets='+f.sheets; states[k]=(states[k]||0)+1 }
  console.log('---', word, 'frames', frames.length)
  console.log(states)
}
fs.writeFileSync(PAGE, src)
await p.screenshot({ path: OUT + '/tailwind-after-hmr.png' })
await ctx.close(); await b.close()
