import { chromium } from 'playwright'
import { mkdirSync } from 'fs'
const base = process.env.BASE || 'http://localhost:3000'
const outDir = process.env.OUT || '/workspace/.next-maintainer/reproduction-artifacts/playwright/dev'
mkdirSync(outDir, { recursive: true })
const b = await chromium.launch()
async function run(label, href, tag) {
  const page = await b.newPage()
  await page.goto(base, { waitUntil: 'networkidle' })
  const t0 = Date.now()
  await page.fill('#target', href)
  await page.click('#go')
  let sawLoading = false, loadingAt = null
  while (Date.now() - t0 < 15000) {
    if (!sawLoading && await page.locator('#loading').count()) { sawLoading = true; loadingAt = Date.now() - t0; await page.screenshot({ path: `${outDir}/${tag}-loading.png` }) }
    if (await page.locator('#page').count()) break
    await page.waitForTimeout(50)
  }
  const done = Date.now() - t0
  await page.screenshot({ path: `${outDir}/${tag}-final.png` })
  console.log(`${label}: loadingUIShown=${sawLoading}${sawLoading?` @${loadingAt}ms`:''} pageContentAfter=${done}ms`)
  await page.close()
}
const rnd = Math.random().toString(36).slice(2, 7)
await run('/blog/a  (listed in generateStaticParams, prerendered)', '/blog/a', 'blog-listed')
await run(`/blog/${rnd} (NOT listed -> generated on demand, 1st visit)`, `/blog/${rnd}`, 'blog-ondemand-1')
await run(`/blog/${rnd} (same slug, 2nd visit, now cached)`, `/blog/${rnd}`, 'blog-ondemand-2')
await run('/nostatic/x (control: no generateStaticParams)', '/nostatic/x', 'nostatic')
await b.close()
