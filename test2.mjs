import { chromium } from 'playwright'
const OUT = process.env.OUT || './artifacts'
const base = process.env.BASE || 'http://localhost:3000'
const tag = process.env.TAG || 'canary'
const b = await chromium.launch()
const out = {}
// client-side nav with missing hash
{
  const p = await b.newPage({ viewport: { width: 900, height: 700 } })
  await p.goto(`${base}/missinghash/a`, { waitUntil: 'networkidle' })
  await p.evaluate(() => window.scrollTo(0, 2000))
  await p.waitForTimeout(300)
  await p.click('#link-b')
  await p.waitForFunction(() => document.querySelector('#page-title')?.textContent?.includes('b'))
  await p.waitForTimeout(800)
  out.clientNavMissingHash = { url: p.url(), scrollY: await p.evaluate(() => window.scrollY) }
  await p.screenshot({ path: `${OUT}/${tag}-missinghash-clientnav.png` })
  await p.close()
}
// full page load with the same missing hash = browser baseline
{
  const p = await b.newPage({ viewport: { width: 900, height: 700 } })
  await p.goto(`${base}/missinghash/b#no-such-anchor`, { waitUntil: 'networkidle' })
  await p.waitForTimeout(500)
  out.fullLoadMissingHash = { url: p.url(), scrollY: await p.evaluate(() => window.scrollY) }
  await p.close()
}
console.log(JSON.stringify(out))
await b.close()
