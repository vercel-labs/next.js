import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage()
await p.goto('http://localhost:3001/')
const out = {}
for (const id of ['bind-form','closure-form']) {
  await p.click(`#${id} button`)
  await p.waitForTimeout(2000)
  out[id] = await p.textContent(`#${id} pre`)
}
await p.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/submitted.png', fullPage: true })
console.log(JSON.stringify(out, null, 2))
await b.close()
