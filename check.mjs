import { chromium } from 'playwright'
const url = process.argv[2] || 'http://localhost:3000'
const tag = process.argv[3] || 'run'
const b = await chromium.launch()
const p = await b.newPage()
p.on('console', (m) => console.log('console:', m.text()))
p.on('pageerror', (e) => console.log('pageerror:', e.message))
await p.goto(url, { waitUntil: 'networkidle' })
await new Promise((r) => setTimeout(r, 4000))
const eff = await p.getByTestId('effect-status').textContent()
console.log('effect-status after 4s:', eff)
await p.getByTestId('click-btn').click()
await new Promise((r) => setTimeout(r, 2000))
console.log('click-status after click:', await p.getByTestId('click-status').textContent())
console.log('effect-status now:', await p.getByTestId('effect-status').textContent())
await p.screenshot({ path: `/workspace/.next-maintainer/reproduction-artifacts/playwright/${tag}.png`, fullPage: true })
await b.close()
