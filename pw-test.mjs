import { chromium } from 'playwright'

const base = 'http://localhost:3000'
const get = async (p) => (await fetch(base + p)).text()
const ts = async (p, re) => (await get(p)).match(re)?.[0]
const tags = async () => await (await fetch(base + '/api/tags')).text()

const browser = await chromium.launch()
const page = await browser.newPage()
const shot = (n) =>
  page.screenshot({
    path: `/workspace/.next-maintainer/reproduction-artifacts/playwright/${n}.png`,
  })

console.log('paths before:', await ts('/a', /A:\d+/), await ts('/b', /B:\d+/))
console.log('tags  before:', await tags())

await page.goto(base + '/action')
await shot('action-page')
await page.click('#paths')
await page.waitForTimeout(1500)
await get('/a'); await get('/b')
await new Promise((r) => setTimeout(r, 2500))
console.log('paths after server action:', await ts('/a', /A:\d+/), await ts('/b', /B:\d+/))

await page.goto(base + '/action')
await page.click('#tags')
await page.waitForTimeout(1500)
await tags()
await new Promise((r) => setTimeout(r, 2500))
console.log('tags  after server action:', await tags())
await shot('after')
await browser.close()
