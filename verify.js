// Walks the reporter's steps with Playwright and reports whether the
// next/script tag re-executes after client-side navigation back to /services.
const { chromium } = require('playwright')
const BASE = process.env.BASE_URL || 'http://localhost:3000'

async function state(page, label) {
  const s = await page.evaluate(() => ({
    localScriptTags: document.querySelectorAll('script[src="/local-widget.js"]').length,
    localExecutions: window.__localWidgetExecutions || 0,
    localWidgetRendered: !!document.getElementById('local-widget'),
    twitterIframe: document.querySelectorAll('#widget-root iframe').length,
  }))
  console.log(label, JSON.stringify(s))
  return s
}

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.click('text=about'); await page.waitForSelector('#about')
  await page.click('text=services'); await page.waitForSelector('#services')
  await page.waitForTimeout(4000)
  await state(page, '1-first-visit-services  ')
  await page.click('text=about'); await page.waitForSelector('#about')
  await page.click('text=services'); await page.waitForSelector('#services')
  await page.waitForTimeout(4000)
  await state(page, '2-second-visit-services ')
  await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(4000)
  await state(page, '3-hard-reload-services  ')
  await browser.close()
})()
