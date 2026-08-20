import { chromium, webkit } from 'playwright'
const url = process.argv[2]
const label = process.argv[3] || 'run'
import fs from 'fs'
const dir = './playwright-out'
for (const [name, type] of [['chromium', chromium], ['webkit', webkit]]) {
  fs.mkdirSync(dir, { recursive: true })
  const browser = await type.launch()
  const page = await browser.newPage()
  const t0 = Date.now()
  const log = []
  page.goto(url).catch(() => {})
  let sawShell = null, sawFallback = null, sawCar = null
  while (Date.now() - t0 < 12000) {
    const s = await page.evaluate(() => ({
      shell: !!document.getElementById('shell'),
      fallback: !!document.getElementById('fallback'),
      car: !!document.getElementById('car'),
    })).catch(() => null)
    if (s) {
      if (s.shell && sawShell === null) sawShell = Date.now() - t0
      if (s.fallback && sawFallback === null) sawFallback = Date.now() - t0
      if (s.car && sawCar === null) { sawCar = Date.now() - t0; break }
    }
    await new Promise((r) => setTimeout(r, 100))
  }
  await page.screenshot({ path: `${dir}/${label}-${name}.png` })
  console.log(`${label} ${name}: shell@${sawShell}ms fallback@${sawFallback}ms car@${sawCar}ms`)
  await browser.close()
}
