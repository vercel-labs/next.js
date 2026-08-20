import { chromium } from 'playwright'
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch({ executablePath: '/root/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome' })
const ctx = await b.newContext()
const page = await ctx.newPage()
const log = []
async function run(id, label) {
  await page.goto('http://localhost:3000/blog/post', { waitUntil: 'networkidle' })
  const before = page.url()
  await page.click('#' + id)
  await page.waitForTimeout(2500)
  const after = page.url()
  const heading = await page.evaluate(() => document.querySelector('h1')?.id + ' | ' + document.querySelector('h1')?.textContent)
  log.push(`${label}: from ${before} -> ${after} (h1: ${heading})`)
  await page.screenshot({ path: `${OUT}/${id}.png` })
}
await run('link-up', 'Link href="../"')
await run('push-up', "router.push('../')")
await run('native-up', 'native <a href="/">')
console.log(log.join('\n'))
await b.close()
