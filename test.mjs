import { chromium } from 'playwright'
const base = process.env.BASE || 'http://localhost:3100'
const b = await chromium.launch()
const p = await b.newPage()
const log = []
await p.goto(base + '/', { waitUntil: 'networkidle' })
log.push(['home', await p.title()])
await p.click('#l-bitcoin'); await p.waitForFunction(() => document.querySelector('#h')?.textContent?.includes('bitcoin'))
await p.waitForTimeout(1000)
log.push(['after nav to /coin/bitcoin', p.url(), await p.title()])
await p.click('#l-ethereum'); await p.waitForFunction(() => document.querySelector('#h')?.textContent?.includes('ethereum'))
await p.waitForTimeout(1500)
log.push(['after nav to /coin/ethereum', p.url(), await p.title(), 'headTitleTags=' + JSON.stringify(await p.$$eval('title', ts => ts.map(t=>t.textContent)))])
await p.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/ethereum-page.png' })
// back to home then other coin
await p.click('#l-home'); await p.waitForTimeout(800)
log.push(['home again', await p.title()])
await p.click('#l-bitcoin'); await p.waitForTimeout(1200)
log.push(['nav bitcoin again', p.url(), await p.title()])
console.log(log.map(l=>l.join(' | ')).join('\n'))
await b.close()
