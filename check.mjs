import { chromium } from 'playwright'
import fs from 'node:fs'

const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const browser = await chromium.launch()
const page = await browser.newPage()
const logs = []
page.on('console', (m) => logs.push(`[console.${m.type()}] ${m.text()}`))
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message.split('\n')[0]}`))

await page.goto('http://127.0.0.1:3100/', { waitUntil: 'load' })
await page.waitForTimeout(1500)
console.log('initial DOM:', await page.textContent('#secret'))
await page.click('#nav')
await page.waitForTimeout(3000)
console.log('url after nav:', page.url())
console.log('#other present:', await page.locator('#other').count())
await page.screenshot({ path: `${OUT}/repro-71601.png`, fullPage: true })
console.log('--- browser console ---')
console.log(logs.join('\n'))
fs.writeFileSync(`${OUT}/browser-console.log`, logs.join('\n') + '\n')
await browser.close()
