import { chromium } from 'playwright'
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const browser = await chromium.launch()
for (const [name, base] of [['nav-direct','http://localhost:3010'],['nav-proxy-lowercase','http://localhost:3011'],['nav-proxy-decoded-at','http://localhost:3012']]) {
  const page = await (await browser.newContext()).newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push('pageerror: ' + (e.name||'') + ': ' + e.message))
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await page.click('#to-en').catch(e=>errors.push('click: '+e.message.split('\n')[0]))
  await page.waitForTimeout(3000)
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true })
  console.log('===', name, '| url after nav:', page.url())
  console.log('  body:', (await page.textContent('body')).slice(0,120).replace(/\s+/g,' '))
  console.log('  errors:', errors.length ? errors : 'none')
}
await browser.close()
