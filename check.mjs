import { chromium } from 'playwright'

const url = process.argv[2] || 'http://localhost:3000/'
const N = Number(process.argv[3] || 5)

const browser = await chromium.launch()
let hits = 0
for (let i = 0; i < N; i++) {
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  const errs = []
  page.on('pageerror', (e) => errs.push(e.stack || e.message))
  await page.goto(url, { waitUntil: 'load' }).catch((e) => errs.push('nav: ' + e.message))
  await page.waitForTimeout(2500)
  if (errs.length) {
    hits++
    console.log(`run ${i}: UNCAUGHT`)
    errs.forEach((e) => console.log(e.split('\n').slice(0, 6).join('\n')))
  } else {
    console.log(`run ${i}: ok (${page.url()})`)
  }
  await ctx.close()
}
console.log(`\n${hits}/${N} loads threw an uncaught error`)
await browser.close()
