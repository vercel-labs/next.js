import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

const RUNS = Number(process.env.RUNS || 24)
const EVID = process.env.EVIDENCE_DIR || './playwright-report'

type Rsc = {
  url: string
  status: number
  prefetch: boolean
  at: number
  bodyLen: number
  statuses: string[]
}
type Result = {
  run: number
  applied: boolean
  serverStatusBefore: string
  serverStatusAfter: string
  textBefore: string
  textAfter: string
  refreshAt: number
  refreshRsc: Rsc[]
}
const results: Result[] = []

for (let i = 1; i <= RUNS; i++) {
  test(`run ${i}`, async ({ page, request }) => {
    const rsc: Rsc[] = []
    page.on('response', async (res) => {
      const u = res.url()
      if (!u.includes('_rsc=')) return
      const h = res.request().headers()
      let body = ''
      try {
        body = await res.text()
      } catch {}
      rsc.push({
        url: u.replace(/^https?:\/\/[^/]+/, ''),
        status: res.status(),
        prefetch: Boolean(h['next-router-prefetch']),
        at: Date.now(),
        bodyLen: body.length,
        // every status token the payload carries for the rows
        statuses: Array.from(new Set((body.match(/(?:pending|done-\d+)/g) || []))),
      })
    })

    const serverStatusBefore = (await (await request.get('/api/rows')).json()).rows[0].status

    await page.goto('/', { waitUntil: 'load' })
    await page.waitForTimeout(300) // let the layout EventSource connect
    await page.click('#to-rows')
    await page.waitForSelector('#row-1')
    const textBefore = await page.locator('main').innerText()

    await page.waitForFunction(() => (window as any).__refreshes > 0, null, { timeout: 15000 })
    const refreshAt = await page.evaluate(() => (window as any).__refreshAt)
    // RETRY=1 checks the reporter's claim that a second router.refresh()
    // ~1.5s later is deduplicated and cannot recover the lost update.
    let retryRequests = -1
    if (process.env.RETRY === '1') {
      await page.waitForTimeout(1500)
      const beforeRetry = Date.now()
      await page.evaluate(() => (window as any).__refresh?.())
      retryRequests = 0
      await page.waitForTimeout(8000)
      retryRequests = rsc.filter((r) => r.at >= beforeRetry && !r.prefetch).length
    } else {
      await page.waitForTimeout(9500)
    }
    const textAfter = await page.locator('main').innerText()
    const serverStatusAfter = (await (await request.get('/api/rows')).json()).rows[0].status

    const applied = textAfter.includes(serverStatusAfter)
    const refreshRsc = rsc.filter((r) => r.at >= refreshAt - 50)
    results.push({
      run: i,
      applied,
      serverStatusBefore,
      serverStatusAfter,
      textBefore,
      textAfter,
      refreshAt,
      refreshRsc,
    })
    console.log(
      `run ${i}: applied=${applied} server:${serverStatusBefore}->${serverStatusAfter} ` +
        `refreshRequests=${refreshRsc.length} ` +
        refreshRsc.map((r) => `[${r.status} prefetch=${r.prefetch} len=${r.bodyLen} statuses=${r.statuses.join('|')}]`).join('') +
        ` retryRequests=${retryRequests} textAfterUnchanged=${textAfter === textBefore}`
    )
    if (!applied) {
      await page.screenshot({ path: path.join(EVID, `fail-run-${i}.png`), fullPage: true })
    }
  })
}

test.afterAll(() => {
  fs.mkdirSync(EVID, { recursive: true })
  fs.writeFileSync(path.join(EVID, 'runs.json'), JSON.stringify(results, null, 2))
  const failed = results.filter((r) => !r.applied)
  console.log(`\n=== SUMMARY: refresh payload not applied in ${failed.length}/${results.length} runs ===`)
  for (const f of failed) {
    const r = f.refreshRsc.find((x) => !x.prefetch)
    console.log(
      `  FAIL run ${f.run}: server had ${f.serverStatusAfter}; refresh response status=${r?.status} ` +
        `payload statuses=${r?.statuses.join('|')} ; rendered text still ${JSON.stringify(f.textAfter.replace(/\n+/g, ' '))}`
    )
  }
})
