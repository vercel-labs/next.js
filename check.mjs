import { chromium } from 'playwright'
const path = process.argv[2], out = process.argv[3]
const b = await chromium.launch()
const p = await b.newPage()
const errs = []
p.on('console', m => m.type() === 'error' && errs.push(m.text()))
await p.goto('http://localhost:3000' + path, { waitUntil: 'networkidle' })
await p.waitForTimeout(2500)
console.log('BODY:', (await p.locator('body').innerText()).slice(0, 600))
console.log('CONSOLE ERRORS:', errs.slice(0,3).join(' | ').slice(0,600))
await p.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/' + out, fullPage: true })
await b.close()
