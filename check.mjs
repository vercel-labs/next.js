import { chromium } from 'playwright'
const base = process.env.BASE || 'http://localhost:3001'
const out = '/workspace/.next-maintainer/reproduction-artifacts/playwright/'
const b = await chromium.launch()
const cases = [['promo-group-no-error','/promo'],['admin-group-with-error','/dashboard/panel'],['plain','/plain/throw']]
for (const [name, url] of cases) {
  const p = await b.newPage()
  const r = await p.goto(base + url, { waitUntil: 'networkidle' })
  await p.waitForTimeout(1500)
  const text = (await p.locator('body').innerText()).slice(0, 200).replace(/\n/g,' | ')
  console.log('[direct]', url, 'status=' + r.status(), '=>', JSON.stringify(text))
  await p.screenshot({ path: out + name + '.png', fullPage: true })
  await p.close()
}
for (const [name, url] of cases) {
  const p = await b.newPage()
  await p.goto(base + '/', { waitUntil: 'networkidle' })
  await p.click(`a[href="${url}"]`)
  await p.waitForTimeout(2500)
  console.log('[client-nav]', url, '=>', JSON.stringify((await p.locator('body').innerText()).slice(0,200).replace(/\n/g,' | ')))
  await p.screenshot({ path: out + name + '-client-nav.png', fullPage: true })
  await p.close()
}
await b.close()
