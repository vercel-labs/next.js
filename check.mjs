import { chromium } from 'playwright'
const out = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
for (const js of [false, true]) {
  const b = await chromium.launch()
  const ctx = await b.newContext({ javaScriptEnabled: js })
  const p = await ctx.newPage()
  await p.goto('http://localhost:3100/dynamic', { waitUntil: 'load' })
  await p.waitForTimeout(6000)
  const text = (await p.locator('body').innerText()).trim()
  console.log(`javaScriptEnabled=${js} visibleText=${JSON.stringify(text)}`)
  await p.screenshot({ path: `${out}/dynamic-js-${js ? 'enabled' : 'disabled'}.png`, fullPage: true })
  await b.close()
}
