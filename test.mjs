import { chromium } from 'playwright'
const label = process.argv[2] || 'run'
const art = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch()
const p = await b.newPage()
const res = {}
for (const [name, sel] of [['href-query', '#masked-link'], ['href-different-page', '#masked-link2'], ['router-push', '#push-btn']]) {
  await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
  await p.evaluate(() => { window.__spa = true })
  await p.click(sel)
  await p.waitForSelector('#page')
  await p.waitForTimeout(700)
  res[name] = {
    displayedUrl: p.url(),
    renderedPage: await p.textContent('#page'),
    query: await p.$eval('#query', e => e.textContent).catch(() => null),
    asPath: await p.$eval('#asPath', e => e.textContent).catch(() => null),
    softNavigation: await p.evaluate(() => window.__spa === true),
  }
  await p.screenshot({ path: `${art}/${label}-${name}.png`, fullPage: true })
}
console.log(JSON.stringify({ label, ...res }, null, 2))
await b.close()
