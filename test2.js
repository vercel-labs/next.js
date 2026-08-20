const { chromium } = require('playwright')
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const base = process.env.BASE || 'http://localhost:3000'
const tag = process.env.TAG || 'x'
const sleep = (ms) => new Promise(r => setTimeout(r, ms))
;(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--no-sandbox'] })
  const p = await b.newPage()
  const state = async (label) => {
    const view = await p.textContent('#view').catch(() => '(no #view)')
    console.log(`${label}: url=${new URL(p.url()).pathname} view="${view}"`)
    await p.screenshot({ path: `${OUT}/${tag}-${label.replace(/[^a-z0-9]+/gi,'-')}.png` })
  }
  console.log('--- S4: home -> pushState(/c) -> Link /b -> Back (url /c) -> Back (url /) ---')
  await p.goto(base + '/'); await p.waitForSelector('#view')
  await p.click('#push-c'); await sleep(600); await state('s4-1-pushed-c')
  await p.click('#link-b'); await sleep(1500); await state('s4-2-on-b')
  await p.goBack(); await sleep(1500); await state('s4-3-back-url-c')
  await p.goBack(); await sleep(1500); await state('s4-4-back-url-root')
  await p.goForward(); await sleep(1500); await state('s4-5-fwd-url-c')

  console.log('--- S5: /a -> pushState(/c) -> Link / -> Back (url /c) ---')
  await p.goto(base + '/a'); await p.waitForSelector('#view'); await state('s5-1-on-a')
  await p.click('#push-c'); await sleep(600); await state('s5-2-pushed-c')
  await p.click('#link-home'); await sleep(1500); await state('s5-3-on-home')
  await p.goBack(); await sleep(1500); await state('s5-4-back-url-c')
  await b.close()
})()
