// Compares rendering with font-feature-settings on/off for next/font/google Inter
// vs. the official Inter used through next/font/local.
import { chromium } from 'playwright'

const out = process.env.OUT_DIR ?? '.'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1100, height: 700 } })
await page.goto(process.argv[2] ?? 'http://localhost:3000', { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)

for (const label of ['google', 'local']) {
  const off = page.getByTestId(`${label}-off`)
  const on = page.getByTestId(`${label}-on`)
  const [a, b] = [await off.screenshot(), await on.screenshot()]
  const same = Buffer.compare(a, b) === 0
  await off.screenshot({ path: `${out}/${label}-off.png` })
  await on.screenshot({ path: `${out}/${label}-on.png` })
  console.log(
    `${label}: font-feature-settings has ${same ? 'NO effect (identical pixels)' : 'an effect (pixels differ)'}`
  )
}
await page.screenshot({ path: `${out}/page.png`, fullPage: true })
await browser.close()
