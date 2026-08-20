// Usage: node scroll-test.js  (server must be running on :3000)
const { chromium } = require('playwright')
const OUT = process.env.OUT_DIR || '.'
const EXEC = process.env.CHROME_PATH

async function check(browser, label, from, to, clickId) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  await page.goto('http://localhost:3000' + from, { waitUntil: 'networkidle' })
  await page.evaluate(() => window.scrollTo(0, 2000))
  await page.waitForTimeout(500)
  const before = await page.evaluate(() => window.scrollY)
  await page.click('#' + clickId)
  await page.waitForURL('**' + to)
  await page.waitForTimeout(800)
  await page.goBack()
  await page.waitForTimeout(2000)
  const afterBack = await page.evaluate(() => window.scrollY)
  await page.screenshot({ path: `${OUT}/${label}-after-back.png` })
  console.log(JSON.stringify({ label, route: from, before, afterBack, restored: afterBack === before }))
  await page.close()
}

;(async () => {
  const browser = await chromium.launch(EXEC ? { executablePath: EXEC } : {})
  await check(browser, 'pages-router', '/', '/page2', 'to-page2')
  await check(browser, 'app-router', '/page3', '/page4', 'to-page4')
  await browser.close()
})()
