import { chromium } from 'playwright'

const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const base = process.env.BASE_URL || 'http://localhost:3000'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1000, height: 700 } })
await page.goto(base)
await page.waitForTimeout(1500)

async function probe(kind, id) {
  await page.goto(base) // reset
  await page.waitForTimeout(800)
  await page.click(`fieldset:has(legend:text-is("${kind}")) a[href="#${id}"]`)
  await page.waitForTimeout(1200)
  const res = await page.evaluate((id) => ({
    scrollY: Math.round(window.scrollY),
    top: Math.round(document.getElementById(id).getBoundingClientRect().top),
    isTarget: document.getElementById(id).matches(':target'),
    hash: location.hash,
  }), id)
  await page.screenshot({ path: `${OUT}/${kind === '<Link/>' ? 'link' : 'anchor'}-${id}.png` })
  console.log(kind, '#' + id, JSON.stringify(res))
  return res
}

const results = {}
for (const id of ['2', '3']) {
  results['a' + id] = await probe('<a/>', id)
  results['link' + id] = await probe('<Link/>', id)
}
console.log('\n--- expected element top === 100 (scroll-margin-top) ---')
for (const [k, v] of Object.entries(results)) console.log(k, 'elementTop=' + v.top, 'scrollY=' + v.scrollY, ':target=' + v.isTarget)
await browser.close()
