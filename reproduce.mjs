// Optional automated driver: node reproduce.mjs http://localhost:3000 '#to-map'
// (requires `npm i -D playwright && npx playwright install chromium`)
import { chromium } from 'playwright'
const base = process.argv[2] || 'http://localhost:3000'
const route = process.argv[3] || '#to-map'
const b = await chromium.launch()
const p = await b.newPage()
p.on('console', (m) => console.log(`[console.${m.type()}]`, m.text()))
p.on('pageerror', (e) => console.log('[pageerror]', e.message))
await p.goto(base + '/', { waitUntil: 'networkidle' })
await p.click(route)
await p.waitForTimeout(800)
console.log('--- on route ---')
await p.click('#to-home')
await p.waitForTimeout(800)
console.log('--- back on / (route hidden by <Activity>) ---')
await p.click(route)
await p.waitForTimeout(1200)
console.log('--- route reappeared ---')
console.log(
  'container:',
  await p.locator('#map-container').innerHTML({ timeout: 3000 }).catch(() => 'MISSING (route crashed)')
)
await b.close()
