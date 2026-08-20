import { chromium } from 'playwright'
const url = process.argv[2] || 'http://localhost:3000/'
const out = process.argv[3] || 'dev'
const b = await chromium.launch()
const p = await b.newPage()
await p.goto(url, { waitUntil: 'networkidle' })
const read = async () => ({
  withParams: await p.textContent('#with-params'),
  plain: await p.textContent('#plain'),
  url: p.url(),
})
console.log('before', await read())
for (let i = 0; i < 3; i++) {
  await p.click('#replace')
  await p.waitForTimeout(800)
  console.log('after click', i + 1, await read())
}
await p.screenshot({ path: `/workspace/.next-maintainer/reproduction-artifacts/playwright/${out}.png`, fullPage: true })
await b.close()
