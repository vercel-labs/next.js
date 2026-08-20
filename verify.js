const { chromium } = require('playwright')
const OUT = process.env.OUT_DIR || '.'
const tag = process.argv[2] || 'run'
;(async () => {
  const browser = await chromium.launch()
  for (const mode of ['link', 'push']) {
    const page = await browser.newPage()
    await page.goto('http://localhost:3123/', { waitUntil: 'networkidle' })
    await page.click(mode === 'link' ? '#to-example' : '#push-example')
    await page.waitForTimeout(2500)
    const body = (await page.locator('body').innerText()).slice(0, 200)
    console.log(`[${tag}][${mode}] url=${page.url()} rendered=${await page.locator('#example').count()} body=${JSON.stringify(body)}`)
    await page.screenshot({ path: `${OUT}/${tag}-${mode}.png`, fullPage: true })
    await page.close()
  }
  await browser.close()
})()
