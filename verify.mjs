import { chromium } from 'playwright'
import fs from 'node:fs/promises'

const OUT = process.env.OUT_DIR || '/workspace/.next-maintainer/reproduction-artifacts/playwright'
const PAGE = new URL('./app/page.tsx', import.meta.url).pathname

async function setValue(v) {
  const src = await fs.readFile(PAGE, 'utf8')
  await fs.writeFile(PAGE, src.replace(/VALUE_\d+/, v))
}

async function poll(getText, want, ms = 25000) {
  const t0 = Date.now()
  let last = ''
  while (Date.now() - t0 < ms) {
    try { last = await getText() } catch {}
    if (last.includes(want)) return { ok: true, text: last, ms: Date.now() - t0 }
    await new Promise((r) => setTimeout(r, 500))
  }
  return { ok: false, text: last, ms: Date.now() - t0 }
}

await setValue('VALUE_1')
const browser = await chromium.launch()
const ctx = await browser.newContext()

const direct = await ctx.newPage()
await direct.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
const hosted = await ctx.newPage()
await hosted.goto('http://127.0.0.1:8080/', { waitUntil: 'networkidle' })
const frame = () => hosted.frameLocator('#f').locator('#cached').innerText()
const dtext = () => direct.locator('#cached').innerText()

console.log('initial direct :', await dtext())
console.log('initial iframe :', await frame())

await setValue('VALUE_2')
const rDirect = await poll(dtext, 'VALUE_2')
const rFrame = await poll(frame, 'VALUE_2')
console.log('after edit direct :', JSON.stringify(rDirect))
console.log('after edit iframe :', JSON.stringify(rFrame))

const cookies = await ctx.cookies()
console.log('cookies:', JSON.stringify(cookies))

await direct.screenshot({ path: `${OUT}/direct-after-edit.png` })
await hosted.screenshot({ path: `${OUT}/iframe-after-edit.png` })

// hard reload the iframe host: reporter says value updates after hard refresh
await hosted.reload({ waitUntil: 'networkidle' })
console.log('iframe after reload :', await frame())
await hosted.screenshot({ path: `${OUT}/iframe-after-reload.png` })

await browser.close()
await setValue('VALUE_1')
const verdict = rDirect.ok && !rFrame.ok
console.log(verdict ? 'REPRODUCED: HMR works directly, not in cross-site iframe' : 'NOT REPRODUCED')
process.exit(verdict ? 0 : 1)
