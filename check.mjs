import { chromium } from 'playwright'
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch()
const p = await b.newPage()
const log = []
async function nav(from, linkId, label) {
  await p.goto('http://localhost:3000' + from, { waitUntil: 'networkidle' })
  let sawLoading = false
  const stop = setInterval(async () => {
    try { if (await p.locator('#root-loading').count()) sawLoading = true } catch {}
  }, 50)
  await p.click('#' + linkId)
  await p.waitForTimeout(600)
  if (await p.locator('#root-loading').count()) sawLoading = true
  await p.screenshot({ path: `${OUT}/${label}.png` })
  await p.waitForTimeout(2500)
  clearInterval(stop)
  log.push(`${label}: root loading shown = ${sawLoading}`)
}
await nav('/', 'link-child', 'root-to-child')
await nav('/', 'link-grandchild', 'root-to-grandchild')
await nav('/child', 'link-grandchild', 'child-to-grandchild')
console.log(log.join('\n'))
await b.close()
