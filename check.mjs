import { chromium } from 'playwright'
const url = process.argv[2] || 'http://localhost:3000'
const b = await chromium.launch()
const p = await (await b.newContext()).newPage()
const msgs = []
p.on('console', m => msgs.push(`[${m.type()}] ${m.text()}`))
p.on('pageerror', e => msgs.push(`[pageerror] ${e.message}`))
await p.goto(url, { waitUntil: 'networkidle' })
await p.waitForTimeout(3000)
console.log('--- console ---')
console.log(msgs.join('\n---\n'))
console.log('--- body text ---')
console.log((await p.locator('body').innerText()).slice(0, 800))
await p.screenshot({ path: process.argv[3] || '/workspace/.next-maintainer/reproduction-artifacts/playwright/dev.png', fullPage: true })
await b.close()
