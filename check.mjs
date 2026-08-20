import { chromium } from 'playwright'
const base = process.argv[2]
const tag = process.argv[3]
const dir = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch()
const p = await b.newPage()
// server action case
await p.goto(base + '/', { waitUntil: 'networkidle' })
await p.click('#login')
await p.waitForFunction(() => !document.querySelector('#result').textContent.includes('not submitted'))
const action = await p.textContent('#result')
await p.screenshot({ path: `${dir}/${tag}-action.png` })
// server component case
await p.goto(base + '/rsc', { waitUntil: 'networkidle' })
await p.waitForSelector('#result')
const rsc = await p.textContent('#result')
await p.screenshot({ path: `${dir}/${tag}-rsc.png` })
console.log(`[${tag}] server action -> ${action}`)
console.log(`[${tag}] server component -> ${rsc}`)
await b.close()
