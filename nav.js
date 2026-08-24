const { chromium } = require('playwright')
;(async () => {
  const b = await chromium.launch({ executablePath: process.env.HOME + '/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome' })
  const p = await b.newPage()
  await p.goto('http://localhost:3000/', { waitUntil: 'load' })
  for (let round = 0; round < 3; round++) {
    for (let i = 0; i < 20; i++) {
      await p.click(`a[href="/jobs/job-${i}"]`)
      await p.waitForSelector('article, p', { timeout: 20000 }).catch(() => {})
      await p.goBack()
      await p.waitForSelector('ul', { timeout: 20000 }).catch(() => {})
    }
    console.log('round', round, 'done')
  }
  await p.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/dev-nav-final.png' })
  await b.close()
})()
