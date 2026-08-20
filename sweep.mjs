// Sweeps the Suspense resolve delay and reports, per delay, whether Chromium ever
// PAINTED the fallback (RED compositor frame) before the content (GREEN) appeared.
import { chromium } from 'playwright'
import fs from 'node:fs'
import jpeg from 'jpeg-js'
const BASE = process.env.URL || 'http://localhost:3000/'
const DELAYS = (process.env.DELAYS || '50,100,150,200,300,500,1000,3000').split(',').map(Number)
const RUNS = +(process.env.RUNS || 4)
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
fs.mkdirSync(OUT, { recursive: true })
function classify(b64) {
  const { data } = jpeg.decode(Buffer.from(b64, 'base64'), { useTArray: true })
  let r=0,g=0,bl=0,n=0
  for (let p=0;p<data.length;p+=4*37){r+=data[p];g+=data[p+1];bl+=data[p+2];n++}
  r=Math.round(r/n);g=Math.round(g/n);bl=Math.round(bl/n)
  if (r>120&&g<90) return 'RED'
  if (g>100&&r<100) return 'GREEN'
  if (r>200&&g>200&&bl>200) return 'WHITE'
  return `rgb(${r},${g},${bl})`
}
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 400, height: 200 } })
const page = await ctx.newPage()
const client = await ctx.newCDPSession(page)
const summary = []
for (const delay of DELAYS) {
  const url = `${BASE}?delay=${delay}`
  let painted = 0
  const seqs = []
  await page.goto('about:blank')
  for (let i = 0; i < RUNS; i++) {
    const frames = []
    const onFrame = async (f) => { frames.push({ t: Date.now(), c: classify(f.data) }); try { await client.send('Page.screencastFrameAck', { sessionId: f.sessionId }) } catch {} }
    client.on('Page.screencastFrame', onFrame)
    await client.send('Page.startScreencast', { format: 'jpeg', quality: 40, everyNthFrame: 1 })
    const t0 = Date.now()
    page.goto(url, { waitUntil: 'commit' }).catch(()=>{})
    await page.waitForTimeout(delay + 1500)
    await client.send('Page.stopScreencast')
    client.removeAllListeners('Page.screencastFrame')
    const sawRed = frames.some((f) => f.c === 'RED')
    if (sawRed) painted++
    seqs.push(frames.map(f=>`${f.c}@${f.t-t0}`).join(' '))
  }
  const line = `delay=${delay}ms  fallback painted in ${painted}/${RUNS} loads | ${seqs.map(s=>`[${s}]`).join(' ')}`
  console.log(line)
  summary.push(line)
}
await browser.close()
fs.writeFileSync(`${OUT}/sweep-${(new URL(BASE)).hostname}.txt`, summary.join('\n'))
