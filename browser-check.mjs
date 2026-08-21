// Opens the dev page in Chromium so the HMR client connects, which is what
// triggers the lazy version check in recent Next.js canaries.
import { chromium } from 'playwright'
const outDir =
  process.env.PW_OUT || '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const browser = await chromium.launch()
const page = await browser.newPage()
page.on('console', (m) => console.log('[browser]', m.type(), m.text()))
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
await new Promise((r) => setTimeout(r, 8000))
await page.screenshot({ path: `${outDir}/dev-page.png`, fullPage: true })
await browser.close()
