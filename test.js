const { chromium } = require('playwright')
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const base = process.env.BASE || 'http://localhost:3000'
const sleep = (ms) => new Promise(r => setTimeout(r, ms))
;(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--no-sandbox'] })
  const p = await b.newPage()
  const state = async (label) => {
    const view = await p.textContent('#view').catch(() => '(no #view)')
    console.log(`${label}: url=${new URL(p.url()).pathname} view="${view}"`)
    await p.screenshot({ path: `${OUT}/${label.replace(/[^a-z0-9]+/gi,'-')}.png` })
  }
  console.log('--- scenario 1: pushState to /c from home, then Back ---')
  await p.goto(base + '/'); await p.waitForSelector('#view'); await state('1-home')
  await p.click('#push-c'); await sleep(800); await state('2-after-pushState-c')
  await p.goBack(); await sleep(1200); await state('3-after-back')
  await p.goForward(); await sleep(1200); await state('4-after-forward')

  console.log('--- scenario 2: Link nav to /b, pushState /c, Back ---')
  await p.goto(base + '/'); await p.waitForSelector('#view')
  await p.click('#link-b'); await sleep(1200); await state('5-on-b')
  await p.click('#push-c'); await sleep(800); await state('6-b-pushState-c')
  await p.goBack(); await sleep(1500); await state('7-back-expect-b')
  await p.goBack(); await sleep(1500); await state('8-back-expect-home')

  console.log('--- scenario 3: reload at /c then back ---')
  await p.goto(base + '/'); await p.waitForSelector('#view')
  await p.click('#push-c'); await sleep(500)
  await p.reload(); await sleep(1500); await state('9-reload-at-c')
  await p.goBack(); await sleep(1500); await state('10-back-after-reload')
  await b.close()
})()
