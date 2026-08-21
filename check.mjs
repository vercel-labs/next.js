import { chromium } from 'playwright'
import fs from 'node:fs'
const ART = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
fs.mkdirSync(ART, { recursive: true })
const url = process.argv[2] || 'http://localhost:3000/trigger-not-found'
const hits = []
const browser = await chromium.launch()
const page = await browser.newPage()
const rec = (k, t) => { if (/negative time stamp|cannot be negative/i.test(t)) { hits.push(`[${k}] ${t}`); console.log('HIT', k, t) } }
page.on('console', m => rec('console.' + m.type(), m.text()))
page.on('pageerror', e => rec('pageerror', e.message))
await page.goto(url, { waitUntil: 'load' })
await page.waitForTimeout(4000)
console.log('BODY:', (await page.textContent('body')).slice(0, 200).replace(/\s+/g, ' '))
const tag = url.split('/').pop() || 'root'
await page.screenshot({ path: `${ART}/${tag}.png`, fullPage: true })
fs.appendFileSync(`${ART}/console-hits.txt`, `\n== ${url} ==\n` + (hits.join('\n') || 'no hits') + '\n')
console.log('RESULT', url, hits.length ? 'REPRODUCED' : 'clean')
await browser.close()
