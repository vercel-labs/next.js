const { chromium } = require('playwright')
;(async () => {
  const rounds = Number(process.argv[2] || 20)
  const browser = await chromium.launch()
  let fails = 0
  for (let i = 0; i < rounds; i++) {
    const ctx = await browser.newContext()
    const page = await ctx.newPage()
    const cdp = await ctx.newCDPSession(page)
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: i % 2 ? 6 : 1 })
    await page.goto('http://localhost:3000/', { waitUntil: 'load' })
    await page.waitForSelector('#submit')
    if (i % 3 === 0) await page.waitForTimeout(50)
    await page.click('#submit')
    if (i % 4 === 0) { try { await page.click('#submit', { timeout: 300 }) } catch {} }
    let ok = true
    try {
      await page.waitForFunction(() => document.querySelector('#state')?.textContent?.includes('success') && document.querySelector('#pending')?.textContent === 'settled', null, { timeout: 8000 })
    } catch (e) {
      ok = false; fails++
      console.log('HANG round', i, 'state=', await page.textContent('#state'), 'pending=', await page.textContent('#pending'))
      await page.screenshot({ path: `/workspace/.next-maintainer/reproduction-artifacts/playwright/hang-${process.env.RUN||0}-${i}.png` })
    }
    if (ok) process.stdout.write('.')
    await ctx.close()
  }
  console.log('\nrounds', rounds, 'fails', fails)
  await browser.close()
  process.exit(fails ? 1 : 0)
})()
