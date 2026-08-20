/**
 * Reproduces vercel/next.js#72914 in the browser.
 *
 * Emulates an engine that predates the static URL.parse()/URL.canParse()
 * methods (Safari 17, Chrome/Edge < 126, Firefox < 126) by deleting both
 * statics before any page script runs, then loads a Next.js page.
 *
 * Next.js injects @next/polyfill-module into every page for every browser.
 * That polyfill defines URL.canParse but not URL.parse, so a component that
 * calls URL.parse() crashes with "URL.parse is not a function" while
 * URL.canParse() works -- an inconsistent polyfill surface.
 */
import { chromium } from 'playwright'
import fs from 'node:fs'

const base = process.env.BASE_URL ?? 'http://localhost:3000'
const outDir = process.env.OUT_DIR ?? '.'
const browser = await chromium.launch()
const page = await browser.newPage()
page.on('pageerror', (e) => console.log('[pageerror]', e.message))

// Emulate Safari 17 / Chrome < 126
await page.addInitScript(() => {
  // @ts-ignore
  delete URL.parse
  // @ts-ignore
  delete URL.canParse
})

await page.goto(base + '/client', { waitUntil: 'networkidle' })
const caps = await page.textContent('#caps')
const result = await page.textContent('#result')
console.log('after Next.js polyfills loaded ->', caps)
console.log('URL.parse("https://vercel.com") ->', result)
fs.mkdirSync(outDir, { recursive: true })
await page.screenshot({ path: `${outDir}/client-url-parse.png` })

// For reference: the legacy (nomodule) bundle *does* include core-js' URL.parse
const html = await (await fetch(base + '/client')).text()
const chunk = html.match(/\/_next\/static\/chunks\/polyfills-[^"']+\.js/)
if (chunk) {
  const p2 = await browser.newPage()
  await p2.addInitScript(() => {
    // @ts-ignore
    delete URL.parse
    // @ts-ignore
    delete URL.canParse
  })
  await p2.goto('about:blank')
  await p2.addScriptTag({
    content: await (await fetch(base + chunk[0])).text(),
  })
  console.log(
    'legacy nomodule bundle ->',
    await p2.evaluate(() => ({
      parse: typeof URL.parse,
      canParse: typeof URL.canParse,
    }))
  )
}

await browser.close()

if (!/ERROR/.test(result ?? '')) {
  console.log('NOT reproduced')
  process.exitCode = 1
} else {
  console.log('REPRODUCED: URL.parse missing while URL.canParse is polyfilled')
}
