import { chromium } from 'playwright'
import fs from 'fs'
const dir = process.argv[3] || '.'
const port = process.argv[2]
const CSS = dir + '/app/globals.css'
const LAYOUT = dir + '/app/layout.js'
const b = await chromium.launch()
const p = await (await b.newContext({viewport:{width:800,height:400}})).newPage()
await p.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' })
await p.waitForTimeout(1500)
const csrc = fs.readFileSync(CSS,'utf8'), lsrc = fs.readFileSync(LAYOUT,'utf8')
for (const [label, file, src, repl] of [
  ['css-edit', CSS, csrc, csrc.replace('rgb(0, 128, 0)','rgb(0, 100, 0)')],
  ['layout-edit', LAYOUT, lsrc, lsrc.replace('<body>','<body data-x="1">')],
]) {
  await p.evaluate(() => { window.__frames && (window.__frames.length = 0) })
  fs.writeFileSync(file, repl)
  await p.waitForTimeout(6000)
  const fr = await p.evaluate(() => window.__frames || [])
  const s = {}; for (const f of fr) { const k='body='+f.bodyBg+' el='+f.elBg+' sheets='+f.sheets; s[k]=(s[k]||0)+1 }
  console.log(port, label, fr.length, s)
  fs.writeFileSync(file, src)
  await p.waitForTimeout(5000)
}
await b.close()
