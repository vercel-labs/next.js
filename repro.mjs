import { chromium } from 'playwright'
import fs from 'fs'

const OUT = './artifacts'
fs.mkdirSync(OUT, { recursive: true })
const BASE = process.env.BASE || 'http://localhost:3000'

const ctx = await chromium.launchPersistentContext('/tmp/pw-profile-' + Date.now(), {
  headless: true,
  args: ['--disable-features=IsolateOrigins'],
})
const page = await ctx.newPage()
const net = []
const cdp = await ctx.newCDPSession(page)
await cdp.send('Network.enable')
cdp.on('Network.responseReceived', (e) => {
  net.push({
    url: e.response.url,
    status: e.response.status,
    fromDiskCache: e.response.fromDiskCache,
    cacheControl: e.response.headers['cache-control'] || e.response.headers['Cache-Control'],
    type: e.type,
  })
})

async function state(label) {
  await page.waitForTimeout(1200)
  const status = await page.locator('#status').innerText()
  const rendered = await page.locator('#rendered').innerText()
  const cookies = await ctx.cookies()
  const bypass = cookies.find((c) => c.name === '__prerender_bypass')
  const line = `${label}: status=${status} | cookie=${bypass ? 'set' : 'absent'} | ${rendered}`
  console.log(line)
  await page.screenshot({ path: `${OUT}/${label}.png` })
  return line
}

const lines = []
await page.goto(BASE, { waitUntil: 'networkidle' })
lines.push(await state('0-initial'))
for (const [i, label] of [[1, '1-enable'], [2, '2-disable'], [3, '3-enable-again']]) {
  net.length = 0
  await page.click('#toggle')
  lines.push(await state(label))
  lines.push(
    '  network: ' +
      JSON.stringify(net.filter((r) => r.type !== 'Image' && !r.url.includes('/_next/static')))
  )
}
fs.writeFileSync(`${OUT}/result.txt`, lines.join('\n') + '\n')
await ctx.close()
