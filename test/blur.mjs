// Measures the delay between "image is loaded" and "blur placeholder is removed"
// for a transparent PNG rendered by next/image with placeholder="blur".
// Usage: node test/blur.mjs <baseUrl> <label> [--throttle-js]
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const baseUrl = process.argv[2] || 'http://localhost:3000'
const label = process.argv[3] || 'dev'
const throttleJs = process.argv.includes('--throttle-js')
const outDir = process.env.ARTIFACT_DIR || path.join(process.cwd(), 'artifacts')
fs.mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 900, height: 900 } })

if (throttleJs) {
  // Emulates the reporter/maintainer scenario: client JS (hydration) arrives
  // later than the image bytes. No delay is added to the image request itself.
  await page.route('**/*.js*', async (route) => {
    await new Promise((r) => setTimeout(r, 1500))
    await route.continue()
  })
}

await page.addInitScript(() => {
  window.__log = []
  const tick = () => {
    const img = document.querySelector('#target')
    if (img) {
      window.__log.push({
        t: Math.round(performance.now()),
        loaded: img.complete && img.naturalWidth > 0,
        blur: (img.getAttribute('style') || '').includes('background-image'),
      })
    }
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})

await page.goto(baseUrl, { waitUntil: 'commit' })
await page.waitForSelector('#target')
await page.waitForFunction(
  () => {
    const i = document.querySelector('#target')
    return i && i.complete && i.naturalWidth > 0
  },
  { timeout: 30000 }
)

// screenshot at the moment the image reports as fully loaded
await page.screenshot({ path: path.join(outDir, `${label}-at-image-loaded.png`) })
const styleAtLoad = await page.$eval('#target', (i) => i.getAttribute('style'))

let blurRemoved = true
try {
  await page.waitForFunction(
    () => !(document.querySelector('#target').getAttribute('style') || '').includes('background-image'),
    { timeout: 10000 }
  )
} catch {
  blurRemoved = false
}
await page.screenshot({ path: path.join(outDir, `${label}-after.png`) })

const log = await page.evaluate(() => window.__log)
const firstLoaded = log.find((e) => e.loaded)
const firstNoBlur = log.find((e) => e.loaded && !e.blur)
const framesWithBlurAfterLoad = log.filter((e) => e.loaded && e.blur).length

console.log(`\n=== ${label}${throttleJs ? ' (js throttled 1.5s)' : ''} @ ${baseUrl} ===`)
console.log('inline style when img.complete first became true:\n ', String(styleAtLoad).slice(0, 200))
console.log('image loaded at (ms):', firstLoaded?.t)
console.log('blur placeholder removed at (ms):', firstNoBlur?.t ?? 'never')
console.log(
  'blur still visible for (ms):',
  firstLoaded && firstNoBlur ? firstNoBlur.t - firstLoaded.t : 'never removed'
)
console.log('animation frames painted with loaded image + blur placeholder:', framesWithBlurAfterLoad)
console.log('blur removed within 10s:', blurRemoved)

await browser.close()
