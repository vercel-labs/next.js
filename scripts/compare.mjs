// Screenshots each sample and pixel-diffs what next/font/google renders against the
// hinted font file Google serves to a Windows browser. Requires `npm run dev` to be running.
import fs from 'node:fs'
import { chromium } from 'playwright'
import { PNG } from 'pngjs'
import pixelmatchDefault from 'pixelmatch'

const pixelmatch = pixelmatchDefault.default ?? pixelmatchDefault
const out = new URL('../screenshots/', import.meta.url)
fs.mkdirSync(out, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 900, height: 900 }, deviceScaleFactor: 1 })
await page.goto(process.env.URL ?? 'http://localhost:3000/', { waitUntil: 'networkidle' })
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(1500)
await page.screenshot({ path: new URL('page.png', out).pathname, fullPage: true })

const shot = async (id) => {
  const file = new URL(`${id.replace(/--/g, '_')}.png`, out).pathname
  await page.locator(`[data-testid="${id}"]`).screenshot({ path: file })
  return PNG.sync.read(fs.readFileSync(file))
}

for (const name of ['lato', 'ubuntu', 'open-sans']) {
  for (const size of [15, 16, 17]) {
    const a = await shot(`${name}--next-font-google--${size}`)
    const b = await shot(`${name}--raw-windows-ua--${size}`)
    const c = await shot(`${name}--raw-nextfont-ua--${size}`)
    const total = a.width * a.height
    const diff = new PNG({ width: a.width, height: a.height })
    const vsWindows = pixelmatch(a.data, b.data, diff.data, a.width, a.height, { threshold: 0.02 })
    fs.writeFileSync(new URL(`diff_${name}_${size}.png`, out).pathname, PNG.sync.write(diff))
    const vsUnhinted = pixelmatch(a.data, c.data, null, a.width, a.height, { threshold: 0.02 })
    console.log(
      `${name} ${size}px: next/font vs hinted(Windows UA) = ${vsWindows}/${total} px differ; ` +
        `next/font vs unhinted(next/font UA) = ${vsUnhinted}/${total} px differ`
    )
  }
}
await browser.close()
