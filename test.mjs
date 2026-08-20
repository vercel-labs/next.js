import { chromium } from 'playwright'
const dir = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch()
const p = await b.newPage()
const results = {}
// direct load via python http.server (301 preserving query)
await p.goto('http://localhost:3005/query-test?foo=bar&baz=123')
await p.waitForLoadState('networkidle')
results.directLoad = { url: p.url(), query: await p.textContent('#query') }
await p.screenshot({ path: dir + '/direct-load.png' })
// client-side Link nav
await p.goto('http://localhost:3005/')
await p.click('#to-query')
await p.waitForTimeout(1500)
results.linkNav = { url: p.url(), query: await p.textContent('#query') }
await p.screenshot({ path: dir + '/link-nav.png' })
// canonical after hydration
await p.goto('http://localhost:3005/discover/')
await p.waitForTimeout(1000)
results.canonical = await p.getAttribute('link[rel=canonical]', 'href')
console.log(JSON.stringify(results, null, 2))
await b.close()
