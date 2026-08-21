import { chromium } from 'playwright'
import fs from 'node:fs'
const BASE = process.env.BASE, TAG = process.env.TAG
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 800, height: 600 } })
const errs = []
page.on('pageerror', e => errs.push('pageerror: ' + e.message))
page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()) })
await page.goto(`${BASE}/a`)
await page.waitForSelector('#page-a')
await page.click('#to-b')
const probe = async (label) => {
  const info = await page.evaluate(() => {
    const b = document.querySelector('#page-b')
    const a = document.querySelector('#page-a')
    const anims = document.documentElement.getAnimations({ subtree: true }).map(x => {
      const t = x.effect && x.effect.target
      return { name: x.animationName || x.constructor.name, pseudo: (x.effect && x.effect.pseudoElement) || null, state: x.playState }
    })
    const rect = (el) => el ? (({x,y,width,height}) => ({x,y,width,height}))(el.getBoundingClientRect()) : null
    return {
      html: { dir: document.documentElement.dir, rect: rect(document.documentElement), scrollW: document.documentElement.scrollWidth },
      bodyRect: rect(document.body),
      pageA: rect(a), pageB: rect(b),
      pageBOpacity: b ? getComputedStyle(b).opacity : null,
      anims,
    }
  })
  console.log(TAG, label, JSON.stringify(info))
  await page.screenshot({ path: `${OUT}/${TAG}-${label}.png` })
}
await page.waitForTimeout(600); await probe('mid-transition')
await page.waitForTimeout(3500); await probe('after-transition')
console.log(TAG, 'errors:', JSON.stringify(errs))
await browser.close()
