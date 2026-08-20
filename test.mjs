import { chromium } from 'playwright'
const OUT = './screenshots'
const b = await chromium.launch()
const p = await b.newPage()
const log = []
async function state(label) {
  const s = {
    label,
    url: p.url(),
    serverPage: await p.locator('#server-page').textContent().catch(() => null),
    clientBtn: await p.locator('#next-page').textContent().catch(() => null),
    detail: await p.locator('#detail-page').textContent().catch(() => null),
  }
  log.push(s); console.log(JSON.stringify(s))
  await p.screenshot({ path: `${OUT}/prod-${label}.png`, fullPage: true })
}
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
await state('1-initial')
await p.click('#next-page'); await p.waitForTimeout(1500)
await state('2-page2-no-slot')
await p.click('#open-detail'); await p.waitForTimeout(1500)
await state('3-detail-open')
await p.click('#next-page'); await p.waitForTimeout(2000)
await state('4-page3-with-slot')
await p.click('#next-page'); await p.waitForTimeout(2000)
await state('5-page4-with-slot')
await b.close()
