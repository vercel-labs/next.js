const pw = require('playwright')

const URL = process.env.URL || 'http://localhost:3100/'
const BROWSERS = ['chromium', 'firefox', 'webkit']

// Emulates the timing the Turbopack runtime hits in the wild (slow chunk load,
// Android WebView 140, old Gecko/Pale Moon): the `await Promise.all(otherChunks)`
// in registerChunk resumes from a task, so document.currentScript is null when
// the runtime module calls getAssetPrefix().
function deferChunkAwait() {
  const origAll = Promise.all.bind(Promise)
  Promise.all = (iter) =>
    new Promise((resolve, reject) =>
      origAll(iter).then(
        (v) => setTimeout(() => resolve(v), 0),
        (e) => setTimeout(() => reject(e), 0)
      )
    )
}

;(async () => {
  let failures = 0
  for (const name of BROWSERS) {
    for (const mode of ['plain', 'defer-chunk-await']) {
      const browser = await pw[name].launch()
      const page = await (await browser.newContext()).newPage()
      const errors = []
      page.on('pageerror', (e) => errors.push(e.stack || e.message))
      if (mode === 'defer-chunk-await') await page.addInitScript(deferChunkAwait)
      await page.goto(URL, { waitUntil: 'load' })
      await page.waitForTimeout(3000)
      const state = await page.textContent('#hydration-state').catch(() => '(missing)')
      console.log(`\n=== ${name} / ${mode}: ${state}`)
      if (errors.length) console.log(errors.join('\n'))
      if (mode === 'defer-chunk-await' && /currentScript/.test(errors.join(''))) failures++
      await browser.close()
    }
  }
  console.log(`\nreproduced in ${failures}/${BROWSERS.length} engines`)
})()
