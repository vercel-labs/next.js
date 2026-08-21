import { chromium } from 'playwright'
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const base = process.env.BASE || 'http://localhost:3000'
const b = await chromium.launch({ executablePath: '/root/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome' })
const p = await b.newPage()
for (const route of ['/', '/forced']) {
  await p.goto(base + route, { waitUntil: 'networkidle' })
  const before = await p.locator('#health, #todos').allTextContents()
  console.log(`[${route}] before click:`, before)
  console.log(`[${route}] --- clicking revalidateTag("health") ---`)
  await p.click('#btn')
  await p.waitForTimeout(2500)
  const after = await p.locator('#health, #todos').allTextContents()
  console.log(`[${route}] after click :`, after)
  await p.reload({ waitUntil: 'networkidle' })
  const reload = await p.locator('#health, #todos').allTextContents()
  console.log(`[${route}] after reload:`, reload)
  await p.screenshot({ path: `${OUT}/${route === '/' ? 'root' : 'forced'}-after.png`, fullPage: true })
}
await b.close()
