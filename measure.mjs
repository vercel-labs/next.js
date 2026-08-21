import { chromium } from 'playwright'
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const browser = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome' })

async function run(label, linkId, expectSel) {
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
  const before = { url: page.url(), pathname: await page.textContent('#pathname') }
  const t0 = Date.now()
  await page.click('#link-' + linkId)
  // sample DOM shortly after click
  await page.waitForTimeout(400)
  const at400 = {
    url: page.url(),
    pathname: await page.textContent('#pathname'),
    hasLoadingUI: await page.locator('#loading-slowloading').count() > 0,
    homeStillVisible: await page.locator('#page-home').count() > 0,
  }
  await page.screenshot({ path: `${OUT}/${label}-400ms-after-click.png` })
  await page.waitForSelector(expectSel, { timeout: 20000 })
  const settled = Date.now() - t0
  const after = { url: page.url(), pathname: await page.textContent('#pathname') }
  await page.screenshot({ path: `${OUT}/${label}-settled.png` })
  console.log(JSON.stringify({ label, before, at400, settledMs: settled, after }, null, 2))
  await ctx.close()
}

await run('no-loading-js', 'slow', '#page-slow')
await run('with-loading-js', 'slowloading', '#page-slowloading')
await browser.close()
