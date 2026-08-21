const { chromium } = require('playwright')
const EXE = process.env.HOME + '/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome'

async function run(url, throttle) {
  const browser = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] })
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  await page.addInitScript(() => {
    window.__lt = []
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push({ s: e.startTime, d: e.duration }) }).observe({ type: 'longtask', buffered: true })
  })
  let js = 0, scripts = 0
  page.on('response', async (r) => {
    try {
      if (/\.js(\?|$)/.test(new URL(r.url()).pathname) || (r.headers()['content-type'] || '').includes('javascript')) {
        scripts++
        const b = await r.body(); js += b.length
      }
    } catch {}
  })
  const cdp = await ctx.newCDPSession(page)
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle })
  await page.goto(url, { waitUntil: 'load' })
  await page.waitForTimeout(4000)
  const res = await page.evaluate(() => {
    const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
    const tasks = window.__lt
    const tbt = tasks.reduce((a, t) => a + Math.max(0, Math.min(t.d, t.s + t.d - fcp) - 50), 0)
    return { fcp: Math.round(fcp), tbt: Math.round(tbt), longTasks: tasks.length, maxTask: Math.round(Math.max(0, ...tasks.map(t => t.d))) }
  })
  await browser.close()
  return { ...res, jsKB: +(js / 1024).toFixed(1), scripts }
}

;(async () => {
  const throttle = +(process.env.THROTTLE || 4)
  const targets = process.argv.slice(2).map(s => s.split('='))
  const out = {}
  for (const [name, url] of targets) {
    const runs = []
    for (let i = 0; i < 3; i++) runs.push(await run(url, throttle))
    runs.sort((a, b) => a.tbt - b.tbt)
    out[name] = { median: runs[1], all: runs.map(r => r.tbt) }
    console.log(name, JSON.stringify(out[name]))
  }
  require('fs').writeFileSync(process.env.OUT || 'result.json', JSON.stringify({ throttle, out }, null, 2))
})()
