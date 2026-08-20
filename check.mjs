import { chromium } from 'playwright'
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const base = process.env.BASE || 'http://localhost:3000'

const fiberWalk = () => {
  const el = document.getElementById('template')
  const key = Object.keys(el).find((k) => k.startsWith('__reactFiber$'))
  let f = el[key]
  const chain = []
  while (f && chain.length < 40) {
    const t = f.type
    const name =
      typeof t === 'string'
        ? t
        : t?.displayName || t?.name || (t ? String(t) : null)
    if (name) chain.push(`<${name}> key=${JSON.stringify(f.key)}`)
    if (name === 'LayoutChildMarker') break
    f = f.return
  }
  return chain
}

const browser = await chromium.launch()
const page = await browser.newPage()
const read = async (label) => {
  const info = {
    label,
    url: page.url(),
    serverInspect: await page.locator('#inspect-root-layout-child').textContent(),
    fiberChainTemplateToLayout: await page.evaluate(fiberWalk),
  }
  console.log(JSON.stringify(info, null, 2))
  await page.screenshot({ path: `${OUT}/${label}.png`, fullPage: true })
}
await page.goto(`${base}/a`, { waitUntil: 'networkidle' })
await read('01-initial-a')
await page.getByRole('link', { name: '/b' }).click()
await page.waitForFunction(() => document.getElementById('page')?.textContent === 'page b')
await page.waitForTimeout(500)
await read('02-after-client-nav-to-b')
await browser.close()
