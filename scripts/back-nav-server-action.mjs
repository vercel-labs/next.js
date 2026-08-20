import { chromium } from 'playwright'
const base = process.env.BASE || 'http://localhost:3000'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 800, height: 600 } })
const scroll = async (label, n = 6) => {
  for (let i = 0; i < n; i++) {
    await p.keyboard.press('End')
    await p.waitForTimeout(900)
    console.log(label + i, await p.textContent('#rq-state'))
  }
}
await p.goto(base + '/rq'); await p.waitForSelector('#rq-state'); await p.waitForTimeout(2000)
console.log('MARK pre-scroll', new Date().toISOString()); await scroll('pre')
console.log('MARK nav', new Date().toISOString())
await p.click('#to-item'); await p.waitForTimeout(2000)
console.log('MARK back', new Date().toISOString())
await p.goBack(); await p.waitForSelector('#rq-state'); await p.waitForTimeout(2000)
console.log('post-back state', await p.textContent('#rq-state'))
await scroll('post', 8)
await p.screenshot({ path: process.env.SHOT || '/workspace/.next-maintainer/reproduction-artifacts/playwright/rq2.png' })
console.log('MARK done', new Date().toISOString())
await b.close()
