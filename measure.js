const { chromium } = require('playwright')
const fs = require('fs')
const OUT = './artifacts'

async function run({ throttle, label, url }) {
  const browser = await chromium.launch({ executablePath: process.env.CHROME, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Network.enable')
  if (throttle) {
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false, latency: 400,
      downloadThroughput: (400 * 1024) / 8, uploadThroughput: (400 * 1024) / 8,
    })
  }
  await page.goto(url + '?filter=a', { waitUntil: 'load' })
  await page.waitForSelector('#card')
  await page.evaluate(() => {
    window.__events = []
    const push = (k) => { if (!window.__events.some(e => e.k === k)) window.__events.push({ k, t: performance.now() }) }
    window.__obs = new MutationObserver(() => {
      if (document.getElementById('fallback')) push('fallback')
      const c = document.getElementById('card')
      if (c && c.textContent.includes('for b')) push('card-b')
    })
    window.__obs.observe(document.body, { subtree: true, childList: true, characterData: true })
    window.__urlWatch = setInterval(() => { if (location.search.includes('filter=b')) push('url-b') }, 5)
  })
  await page.click('#filter-b')
  await page.waitForFunction(() => window.__events.some(e => e.k === 'card-b'), null, { timeout: 60000 })
  const { events, clickTs } = await page.evaluate(() => ({ events: window.__events, clickTs: window.__clickTs }))
  await page.screenshot({ path: `${OUT}/${label}-after.png` })
  await browser.close()
  const rel = t => Math.round(t - clickTs)
  const res = { label, throttle: !!throttle, ...Object.fromEntries(events.map(e => [e.k, rel(e.t)])) }
  console.log(JSON.stringify(res))
  return res
}

;(async () => {
  const base = (process.argv[2] || 'http://localhost:3000')
  const out = []
  for (const route of ['/', '/slow-shell', '/loading-file']) {
    for (const throttle of [false, true]) {
      out.push(await run({ throttle, label: `${process.env.TAG || 'prod'}${route.replace(/\//g, '-')}${throttle ? '-slow3g' : ''}`, url: base + route }))
    }
  }
  fs.writeFileSync(`${OUT}/timings-${process.env.TAG || 'prod'}.json`, JSON.stringify(out, null, 2))
})()
