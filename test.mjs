import { chromium } from 'playwright'
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch()
const p = await b.newPage()
// 1) soft nav from home -> modal expected
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
await p.click('#search-link')
await p.waitForSelector('#modal')
console.log('soft nav: modal shown =', await p.locator('#modal').count() > 0)
await p.screenshot({ path: OUT + '/1-soft-nav-modal.png' })

// 2) hard navigate directly to /search?q=food
await p.goto('http://localhost:3000/search?q=food', { waitUntil: 'networkidle' })
console.log('hard nav: full page =', await p.locator('#full-page').count(), 'modal =', await p.locator('#modal').count())
await p.screenshot({ path: OUT + '/2-hard-nav-full-page.png' })

// 3) update query via router.replace from the full page
await p.fill('#full-input', 'food2')
await p.waitForTimeout(3000)
console.log('after router.replace: url =', p.url())
console.log('after router.replace: full page =', await p.locator('#full-page').count(), 'modal =', await p.locator('#modal').count())
await p.screenshot({ path: OUT + '/3-after-query-update.png', fullPage: true })
await b.close()
