// Clicks the "open in editor" code icon in the Segment Explorer and prints the
// /__nextjs_launch-editor request + response status.
import { chromium } from 'playwright'

const url = process.env.URL || 'http://localhost:3001/'
const browser = await chromium.launch()
const page = await browser.newPage()
const seen = []
page.on('response', (r) => {
  if (r.url().includes('__nextjs_launch-editor')) seen.push(`${r.status()} ${r.url()}`)
})
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)
await page.locator('[data-nextjs-dev-tools-button]').click()
await page.waitForTimeout(800)
await page.getByText(/Route Info/i).first().click()
await page.waitForTimeout(1500)

const modern = page.locator('button[aria-label="Open layout.tsx in editor"]')
if (await modern.count()) {
  await modern.first().click()
} else {
  const label = page.locator('.segment-explorer-file-label--layout').first()
  await label.hover()
  await page.waitForTimeout(500)
  await label.locator('svg.code-icon').click({ force: true })
}
await page.waitForTimeout(2000)
console.log(seen.join('\n') || 'no /__nextjs_launch-editor request was made')
await browser.close()
