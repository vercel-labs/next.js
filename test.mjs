import { chromium } from 'playwright'

const BASE = process.env.BASE || 'http://localhost:3000'
const OUT = process.env.OUT || '.'

const browser = await chromium.launch(
  process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}
)
const page = await browser.newPage()
const rsc = []
page.on('request', (r) => {
  const u = r.url()
  if (u.includes('_rsc=')) rsc.push(u.replace(BASE, ''))
})

async function nav(id) {
  rsc.length = 0
  await page.click('#' + id)
  let sawLoading = false
  const t0 = Date.now()
  while (Date.now() - t0 < 2500) {
    if (await page.locator('#loading').count()) { sawLoading = true; break }
    if (await page.locator('#content').count()) break
    await page.waitForTimeout(20)
  }
  await page.locator('#content').waitFor({ timeout: 10000 })
  const url = page.url().replace(BASE, '')
  const content = await page.locator('#content').innerText()
  console.log(`nav -> ${id.padEnd(10)} url=${url.padEnd(22)} loading=${sawLoading ? 'YES' : 'no '} rsc=${rsc.length} content="${content}"`)
  return sawLoading
}

await page.goto(BASE)
const results = { 'no-param': [], 'yes-param': [] }
for (let i = 0; i < 3; i++) {
  for (const id of ['no-param', 'yes-param']) {
    results[id].push(await nav(id))
    await page.click('#home')
    await page.locator('#home-h').waitFor()
  }
}
console.log(JSON.stringify(results))
await page.screenshot({ path: OUT + '/final.png' })
await browser.close()
