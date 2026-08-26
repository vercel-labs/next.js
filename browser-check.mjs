/**
 * Chromium half of vercel/next.js#97918: proves that the guard used at the
 * hot-reloader-app.js call site (`writer.ready`) is *fulfilled* on an already
 * closed writer, and that the subsequent `writer.write(chunk)` throws the exact
 * TypeError the dev overlay reports: "Cannot write to a CLOSED writable stream".
 */
import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto('about:blank')
const result = await page.evaluate(async () => {
  const { readable, writable } = new TransformStream()
  readable.getReader().read()
  const writer = writable.getWriter() // cached per requestId by Next, outlives close
  await writer.ready
  await writer.close()
  const out = { readyState: 'pending', error: null }
  // Verbatim shape of the Next.js call site.
  await new Promise((resolve) => {
    writer.ready.then(
      () => {
        out.readyState = 'fulfilled'
        // Same as `.then(() => writer.write(chunk)).catch(console.error)`:
        // the rejection (or sync throw) lands in the shared catch handler.
        Promise.resolve()
          .then(() => writer.write(new Uint8Array([1, 2, 3])))
          .catch((e) => {
            out.error = `${e.name}: ${e.message}`
          })
          .then(resolve)
      },
      (e) => {
        out.readyState = `rejected (${e && e.message})`
        resolve()
      }
    )
  })
  return out
})
console.log(JSON.stringify(result, null, 2))
await page.screenshot({ path: 'chromium-writer-closed.png' })
await browser.close()
const ok =
  result.readyState === 'fulfilled' && /CLOSED writable stream/i.test(result.error || '')
console.log(ok ? 'REPRODUCED in Chromium' : 'NOT REPRODUCED')
process.exit(ok ? 0 : 1)
