import { chromium } from 'playwright'
const base = process.env.BASE || 'http://localhost:3000'
const b = await chromium.launch()
const p = await b.newPage()
await p.goto(base)
console.log('initial activeElement:', await p.evaluate(() => document.activeElement.tagName + '#' + document.activeElement.id))
await p.click('#about-link')
await p.waitForSelector('h1:text("About page")')
await p.waitForTimeout(1000)
const after = await p.evaluate(() => {
  const e = document.activeElement
  return { tag: e.tagName, id: e.id, href: e.getAttribute?.('href'), focusVisible: e.matches(':focus') }
})
console.log('after client-side nav to /about, activeElement:', JSON.stringify(after))
console.log('h1:', await p.textContent('h1'))
await p.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/after-nav.png', fullPage: true })
await b.close()
