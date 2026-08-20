import { chromium } from 'playwright'
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch()
const p = await b.newPage()
const log = (...a) => console.log(...a)
const state = async (label) => {
  const modal = await p.locator('#modal').count()
  const rootDefault = await p.locator('#root-default').count()
  log(`${label}: url=${p.url().replace(/^http:\/\/[^/]+/, '')} modal=${modal} rootDefault=${rootDefault}`)
  await p.screenshot({ path: `${OUT}/${label}.png` })
}
await p.goto('http://localhost:3000/')
await state('01-home')
await p.click('#open-modal')
await p.waitForTimeout(1500)
await state('02-modal-open-soft-nav')
await p.click('#go-about')
await p.waitForTimeout(1500)
await state('03-after-link-to-about')
await p.goBack(); await p.waitForTimeout(1000); await state('04-after-goBack')
await p.goto('http://localhost:3000/photo/1'); await p.waitForTimeout(800); await state('05-hard-load-photo')
await b.close()
