const { chromium } = require('playwright')
const url = process.argv[2] || 'http://localhost:3111'
const out = process.argv[3] || '/workspace/.next-maintainer/reproduction-artifacts/playwright/dev'
;(async () => {
  const b = await chromium.launch()
  const p = await b.newPage()
  await p.goto(url, { waitUntil: 'networkidle' })
  const read = async () => ({
    link: await p.textContent('#link-child'),
    plain: await p.textContent('#plain-child'),
  })
  console.log('initial', JSON.stringify(await read()))
  for (let i = 0; i < 3; i++) {
    await p.$eval('#update-time', el => el.click())
    await p.waitForTimeout(500)
    console.log('after click ' + (i + 1), JSON.stringify(await read()))
  }
  await p.screenshot({ path: out + '.png', fullPage: true })
  await b.close()
})()
