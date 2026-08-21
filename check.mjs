import { chromium } from 'playwright'
import fs from 'fs'
const url = process.env.URL || 'http://localhost:3000/'
const out = './artifacts'
const tag = process.env.TAG || 'dev'
const b = await chromium.launch()
const p = await b.newPage()
const logs = []
p.on('console', m => logs.push(`[${m.type()}] ${m.text()}`))
p.on('pageerror', e => logs.push(`[pageerror] ${e.message}`))
await p.goto(url, { waitUntil: 'networkidle' })
await p.waitForTimeout(4000)
fs.mkdirSync(out, { recursive: true })
await p.screenshot({ path: `${out}/${tag}.png`, fullPage: true })
const txt = logs.filter(l => !l.includes('inline style violates')).join('\n---\n')
fs.writeFileSync(`${out}/${tag}-console.log`, txt)
console.log(txt.slice(0, 3000))
await b.close()
