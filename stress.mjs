import { chromium } from 'playwright'
import fs from 'node:fs'
import jpeg from 'jpeg-js'
const URL_ = process.env.URL || 'http://localhost:3000/'
const N = +(process.env.N || 10)
const THROTTLE = process.env.THROTTLE === '1'
const MOBILE = process.env.MOBILE === '1'
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
const ctx = await browser.newContext({ viewport: { width: 400, height: 200 }, ...(MOBILE ? { userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36', isMobile: true, hasTouch: true } : {}) })
const page = await ctx.newPage()
const client = await ctx.newCDPSession(page)
if (THROTTLE) {
  await client.send('Network.enable')
  await client.send('Network.emulateNetworkConditions', { offline: false, latency: 300, downloadThroughput: 400*1024/8, uploadThroughput: 400*1024/8 })
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 })
}
let fallbackShown = 0, missed = 0
const details = []
await page.goto(URL_, { waitUntil: 'load' })
for (let i = 0; i < N; i++) {
  const frames = []
  client.on('Page.screencastFrame', async (f) => { frames.push({ t: Date.now(), c: classify(f.data) }); try { await client.send('Page.screencastFrameAck', { sessionId: f.sessionId }) } catch {} })
  await client.send('Page.startScreencast', { format: 'jpeg', quality: 40, everyNthFrame: 1 })
  const t0 = Date.now()
  page.reload({ waitUntil: 'commit' }).catch(()=>{})
  await page.waitForTimeout(3600)
  await client.send('Page.stopScreencast')
  client.removeAllListeners('Page.screencastFrame')
  const seq = frames.map(f=>`${f.c}@${f.t-t0}`)
  const sawRedEarly = frames.some(f => f.c === 'RED' && f.t - t0 < 2800)
  if (sawRedEarly) fallbackShown++; else missed++
  details.push(`run${i} ${sawRedEarly ? 'fallback painted' : 'FALLBACK NOT PAINTED'}: ${seq.join(' ')}`)
}
await browser.close()
console.log(details.join('\n'))
console.log(`\nfallback painted: ${fallbackShown}/${N}, missing: ${missed}/${N} (throttle=${THROTTLE} mobile=${MOBILE})`)
