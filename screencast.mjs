// Captures real compositor frames (CDP screencast) and reports the dominant color
// of each frame: red = Suspense fallback painted, green = resolved content, white = blank.
import { chromium, firefox } from 'playwright'
import fs from 'node:fs'
import zlib from 'node:zlib'

const URL_ = process.env.URL || 'http://localhost:3000/'
const OUT = '/workspace/.next-maintainer/reproduction-artifacts/playwright'
fs.mkdirSync(OUT, { recursive: true })

function pngDominant(buf) {
  // decode PNG (only used for playwright screenshots) - not needed; we use jpeg frames -> skip
  return null
}

async function chromiumRun(mode) {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 400, height: 200 } })
  const client = await page.context().newCDPSession(page)
  const frames = []
  client.on('Page.screencastFrame', async (f) => {
    frames.push({ t: Date.now(), data: f.data })
    try { await client.send('Page.screencastFrameAck', { sessionId: f.sessionId }) } catch {}
  })
  await page.goto(URL_, { waitUntil: 'load' }) // first load, content green
  await client.send('Page.startScreencast', { format: 'jpeg', quality: 60, everyNthFrame: 1 })
  const t0 = Date.now()
  frames.length = 0
  if (mode === 'reload') page.reload({ waitUntil: 'commit' }).catch(() => {})
  else page.goto(URL_ + '?x=' + Math.random(), { waitUntil: 'commit' }).catch(() => {})
  await page.waitForTimeout(4000)
  await client.send('Page.stopScreencast')
  await page.close(); await browser.close()
  return frames.map((f) => ({ dt: f.t - t0, jpeg: f.data }))
}

// analyze jpeg dominant color using a tiny decoder via sharp? use 'jpeg-js' if available
let jpeg
try { jpeg = (await import('jpeg-js')).default } catch {}

for (const mode of ['reload', 'navigate']) {
  const frames = await chromiumRun(mode)
  const rows = frames.map((f, i) => {
    const buf = Buffer.from(f.jpeg, 'base64')
    let color = 'n/a'
    if (jpeg) {
      const { data, width, height } = jpeg.decode(buf, { useTArray: true })
      let r = 0, g = 0, b = 0, n = 0
      for (let p = 0; p < data.length; p += 4 * 37) { r += data[p]; g += data[p+1]; b += data[p+2]; n++ }
      r = Math.round(r/n); g = Math.round(g/n); b = Math.round(b/n)
      color = r > 120 && g < 90 ? 'RED(fallback)' : g > 100 && r < 100 ? 'GREEN(content)' : r > 200 && g > 200 && b > 200 ? 'WHITE(blank)' : `rgb(${r},${g},${b})`
    }
    fs.writeFileSync(`${OUT}/frame-${mode}-${String(i).padStart(3, '0')}-${f.dt}ms.jpg`, buf)
    return `${mode} frame#${i} +${f.dt}ms ${color}`
  })
  console.log(rows.join('\n'))
  console.log(`--- ${mode}: ${frames.length} frames`)
}
