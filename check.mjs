import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage()
await p.goto('http://localhost:3111/', { waitUntil: 'networkidle' })
const v = await p.evaluate(() => ({ prod: globalThis.__MIDDLEWARE_MATCHERS, dev: globalThis.__DEV_MIDDLEWARE_MATCHERS }))
console.log('after load:', JSON.stringify(v, null, 2))
await p.screenshot({ path: '/workspace/.next-maintainer/reproduction-artifacts/playwright/home.png' })
await b.close()
