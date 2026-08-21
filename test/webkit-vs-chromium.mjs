// node test/webkit-vs-chromium.mjs https://<deployment>/
import { webkit, chromium } from "playwright"

const url = process.argv[2]
if (!url) throw new Error("usage: node test/webkit-vs-chromium.mjs <url>")

async function run(name, type) {
  const browser = await type.launch()
  const results = []
  for (let i = 0; i < 3; i++) {
    const page = await (await browser.newContext()).newPage() // empty cache
    const t0 = Date.now()
    await page.goto(url, { waitUntil: "commit" })
    await page.waitForSelector("#toggle", { timeout: 20000 })
    const paintedAt = Date.now() - t0
    let interactiveAt = null
    const deadline = Date.now() + 12000
    while (Date.now() < deadline) {
      try {
        await page.locator("#toggle").click({ timeout: 800, force: true })
      } catch {}
      if ((await page.locator("#popover").count()) > 0) {
        interactiveAt = Date.now() - t0
        break
      }
      await page.waitForTimeout(200)
    }
    results.push({ shellRenderedMs: paintedAt, interactiveMs: interactiveAt })
    await page.context().close()
  }
  console.log(name, JSON.stringify(results))
  await browser.close()
}

await run("webkit  ", webkit)
await run("chromium", chromium)
