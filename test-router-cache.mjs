import { chromium } from 'playwright'
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const b = await chromium.launch()
const ctx = await b.newContext()
const p = await ctx.newPage()
const read = async (label) => {
  const t = await p.textContent('#hits')
  const n = await p.textContent('#now')
  console.log(`${label}: ${t} | ${n}`)
  await p.screenshot({ path: `${OUT}/next14-${label}.png` })
}
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
await read('1-first-load')
for (const i of [2, 3, 4]) {
  await p.click('text=go to /other')
  await p.waitForSelector('text=back home')
  await p.click('text=back home')
  await p.waitForSelector('#hits')
  await read(`${i}-after-client-nav`)
}
await p.reload({ waitUntil: 'networkidle' })
await read('5-hard-reload')
await b.close()
