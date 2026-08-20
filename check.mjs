// Automated check for https://github.com/vercel/next.js/issues/42082
// Usage: node check.mjs [port]   (default 3000, `next start` must already run)
import { chromium } from 'playwright'

const port = process.argv[2] || '3000'
const SEL = '[class*=NotLazyTileWrapper]'
const browser = await chromium.launch()

async function read(page) {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel)
    return {
      backgroundColor: getComputedStyle(el).backgroundColor,
      stylesheetOrder: [...document.styleSheets].map((s) => ({
        href: s.href,
        rules: [...s.cssRules].map((r) => r.cssText),
      })),
    }
  }, SEL)
}

// 1. hard load of /to
const a = await browser.newPage()
await a.goto(`http://localhost:${port}/to`, { waitUntil: 'networkidle' })
const direct = await read(a)
await a.screenshot({ path: 'direct-load.png' })

// 2. /from -> client-side navigation to /to (the /lazy chunk gets prefetched first)
const b = await browser.newPage()
await b.goto(`http://localhost:${port}/from`, { waitUntil: 'networkidle' })
await b.click('a:has-text("Page without link to lazy")')
await b.waitForFunction(() => location.pathname === '/to')
await b.waitForTimeout(1500)
const nav = await read(b)
await b.screenshot({ path: 'client-nav.png' })

console.log('hard load  /to background:', direct.backgroundColor)
console.log('client nav /to background:', nav.backgroundColor)
console.log('\nstylesheets after client navigation:')
console.log(JSON.stringify(nav.stylesheetOrder, null, 2))

await browser.close()

if (direct.backgroundColor !== nav.backgroundColor) {
  console.error('\nBUG REPRODUCED: styling differs depending on navigation type.')
  process.exit(1)
}
console.log('\nOK: identical styling.')
