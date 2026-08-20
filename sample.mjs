import { chromium, firefox } from 'playwright'
import fs from 'node:fs'
const URL_ = process.env.URL || 'http://localhost:3000/'
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const TAG = process.env.TAG || 'prod'
fs.mkdirSync(OUT, { recursive: true })

async function run(bt, name) {
  const browser = await bt.launch({ headless: true })
  const ctx = await browser.newContext({ viewport: { width: 600, height: 300 }, recordVideo: { dir: `${OUT}/video-${TAG}-${name}`, size: { width: 600, height: 300 } } })
  const page = await ctx.newPage()
  const samples = []
  page.goto(URL_, { waitUntil: 'commit' }).catch(() => {})
  const t0 = Date.now()
  while (Date.now() - t0 < 4000) {
    const s = await page.evaluate(() => {
      const l = document.querySelector('#loading')
      const c = document.querySelector('#content')
      const vis = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); const st = getComputedStyle(e); return `${Math.round(r.width)}x${Math.round(r.height)} display=${st.display} vis=${st.visibility}` }
      return { t: Math.round(performance.now()), loading: vis(l), content: vis(c), bodyText: document.body ? document.body.innerText.trim().slice(0, 40) : null, paint: performance.getEntriesByType('paint').map(e=>`${e.name}@${Math.round(e.startTime)}`).join(',') }
    }).catch((e) => ({ err: String(e).split('\n')[0] }))
    samples.push(s)
    await page.waitForTimeout(120)
  }
  await ctx.close(); await browser.close()
  return samples
}
const res = { chromium: await run(chromium, 'chromium'), firefox: await run(firefox, 'firefox') }
fs.writeFileSync(`${OUT}/samples-${TAG}.json`, JSON.stringify(res, null, 2))
for (const [k, v] of Object.entries(res)) {
  console.log('==', k)
  for (const s of v) console.log(JSON.stringify(s))
}
