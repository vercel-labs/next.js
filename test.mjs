import { chromium } from 'playwright'
const base = process.argv[2] || 'http://localhost:3000'
const b = await chromium.launch()
const p = await b.newPage()
p.on('console', m => console.log('[browser]', m.type(), m.text()))
await p.goto(base + '/page1', { waitUntil: 'networkidle' })
await p.click('#to2')
await p.waitForSelector('#p2')
let status = ''
for (let i = 0; i < 15; i++) {
  await p.waitForTimeout(1000)
  status = await p.textContent('#status')
  console.log(i + 's status =', status, 'url =', p.url())
  if (status.startsWith('resolved') || status.startsWith('rejected')) break
}
await p.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/final.png' })
console.log('FINAL STATUS:', status)
await b.close()
process.exit(status.startsWith('resolved') ? 0 : 1)
