import { chromium } from 'playwright'
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch()
const p = await b.newPage()
const read = async () => ({
  url: p.url(),
  test: (await p.textContent('#test')).trim(),
  gipClientCalls: await p.evaluate(() => window.__gip || []),
})
for (const btn of ['#no-hash', '#with-hash']) {
  await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
  await p.evaluate(() => { window.__gip = [] })
  console.log('\n=== ' + btn + ' ===')
  for (let i = 0; i < 3; i++) {
    await p.click(btn)
    await p.waitForTimeout(700)
    console.log('click', i + 1, await read())
  }
  await p.screenshot({ path: OUT + btn.replace('#', '/') + '.png' })
}
await b.close()
