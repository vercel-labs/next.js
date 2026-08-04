import { chromium } from 'playwright'
const OUT = process.env.OUT_DIR ?? '.'
const browser = await chromium.launch({ args: ['--no-sandbox'] })
async function run(url, name) {
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  await page.addInitScript(() => {
    window.__calls = []
    const orig = history.replaceState.bind(history)
    history.replaceState = function (s, t, u) { window.__calls.push(['replaceState', String(u)]); return orig(s, t, u) }
    const op = history.pushState.bind(history)
    history.pushState = function (s, t, u) { window.__calls.push(['pushState', String(u)]); return op(s, t, u) }
  })
  await page.goto(url)
  await page.waitForSelector('button')
  await page.waitForTimeout(1000)
  const before = page.url()
  await page.click('button')
  await page.waitForTimeout(1500)
  const after = page.url()
  const calls = await page.evaluate(() => window.__calls)
  await page.screenshot({ path: `${OUT}/${name}.png` })
  console.log(JSON.stringify({ name, before, after, calls }, null, 2))
  await ctx.close()
}
await run('http://localhost:3000/p/123#modal', 'dynamic-route')
await run('http://localhost:3000/#modal', 'static-route')
await browser.close()
