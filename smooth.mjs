import { chromium } from 'playwright'
const base = process.env.BASE_URL || 'http://localhost:3000'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1000, height: 700 } })

async function smooth(kind) {
  await page.goto(base)
  await page.waitForTimeout(800)
  await page.evaluate(() => {
    window.__samples = []
    const t = setInterval(() => window.__samples.push(Math.round(window.scrollY)), 16)
    setTimeout(() => clearInterval(t), 1500)
  })
  await page.click(`fieldset:has(legend:text-is("${kind}")) a[href="#3"]`)
  await page.waitForTimeout(1600)
  const s = await page.evaluate(() => window.__samples)
  const distinct = new Set(s).size
  console.log(kind, 'distinct scrollY samples during navigation:', distinct, 'first10:', s.slice(0, 12).join(','))
}
await smooth('<a/>')
await smooth('<Link/>')
await browser.close()
