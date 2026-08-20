import { chromium } from 'playwright'
const base = process.argv[2]
const tag = process.argv[3]
const b = await chromium.launch()
const p = await b.newPage()
const log = []
p.on('framenavigated', f => { if (f === p.mainFrame()) log.push(['nav', Date.now(), f.url()]) })
await p.goto(base + "/a?page=1", { waitUntil: 'networkidle' })
console.log('initial content:', await p.textContent('#content'))
const t0 = Date.now()
await p.click('#to-2')
let loadingSeen = null, urlChanged = null, contentChanged = null
const deadline = Date.now() + 8000
while (Date.now() < deadline) {
  if (!loadingSeen && await p.locator('#loading').count()) { loadingSeen = Date.now() - t0; await p.screenshot({path:`/workspace/.next-maintainer/reproduction-artifacts/playwright/${tag}-loading.png`}) }
  if (!urlChanged && p.url().includes('page=2')) urlChanged = Date.now() - t0
  const txt = await p.locator('#content').count() ? await p.textContent('#content') : null
  if (!contentChanged && txt && txt.includes('page 2')) { contentChanged = Date.now() - t0; break }
  await p.waitForTimeout(50)
}
await p.screenshot({path:`/workspace/.next-maintainer/reproduction-artifacts/playwright/${tag}-after.png`})
console.log(JSON.stringify({ tag, loadingSeenMs: loadingSeen, urlChangedMs: urlChanged, contentChangedMs: contentChanged }, null, 2))
// now different route for comparison
const t1 = Date.now()
await p.click('#to-nested')
let l2 = null
const d2 = Date.now() + 8000
while (Date.now() < d2) {
  if (!l2 && await p.locator('#loading').count()) l2 = Date.now() - t1
  const txt = await p.locator('#content').count() ? await p.textContent('#content') : null
  if (txt && txt.includes('Other')) break
  await p.waitForTimeout(50)
}
console.log('different-route loading shown at ms:', l2)
await b.close()
