// Automated reproduction for https://github.com/vercel/next.js/issues/75228
// 1. build + start (marker V1), open a *persistent* browser profile, soft-navigate to /test
// 2. edit /test (marker V2), rebuild, restart
// 3. reopen the SAME browser profile (HTTP cache kept, like a real user session) and click the same link
// Expected: /test shows MARKER_V2 via a client-side navigation.
// Actual (next 15.x): the RSC payload comes from the browser disk cache (build 1),
// the page renders MARKER_V1 and/or the router falls back to a full document request.
import { chromium } from 'playwright'
import { spawn } from 'node:child_process'
import fs from 'node:fs'

const PAGE = 'app/test/page.jsx'
const PROFILE = '.repro-profile'
const PORT = 3000
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit' })
    p.on('exit', (c) => (c === 0 ? resolve() : reject(new Error(cmd + ' failed'))))
  })
}

let server
async function start() {
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', String(PORT)], { stdio: 'inherit', detached: true })
  for (let i = 0; i < 60; i++) {
    try { await fetch(`http://localhost:${PORT}/test`); return } catch { await sleep(500) }
  }
  throw new Error('server did not start')
}
async function stop() {
  if (server) {
    try { process.kill(-server.pid, 'SIGKILL') } catch {}
    for (let i = 0; i < 40; i++) {
      try { await fetch(`http://localhost:${PORT}/test`); await sleep(500) } catch { break }
    }
    server = undefined
  }
}

async function visit(label) {
  const ctx = await chromium.launchPersistentContext(PROFILE, { headless: true, executablePath: process.env.CHROME_PATH || undefined })
  const page = await ctx.newPage()
  const cdp = await ctx.newCDPSession(page)
  await cdp.send('Network.enable')
  const urls = {}
  cdp.on('Network.requestWillBeSent', (e) => { urls[e.requestId] = e.request.url })
  cdp.on('Network.responseReceived', (e) => {
    const url = urls[e.requestId] || ''
    if (url.includes('_rsc=')) {
      console.log(`  [rsc] ${e.response.status} ${url} fromDiskCache=${e.response.fromDiskCache} cache-control="${e.response.headers['cache-control'] || e.response.headers['Cache-Control']}"`)
    }
  })
  const docs = []
  page.on('request', (r) => { if (r.resourceType() === 'document') docs.push(r.url()) })
  page.on('console', (m) => { if (m.type() === 'error' || m.text().includes('RSC')) console.log(`  [console.${m.type()}] ${m.text()}`) })
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' })
  docs.length = 0
  await page.click('a[href="/test"]')
  await page.waitForTimeout(2500)
  const rendered = (await page.locator('#marker').innerText()).trim()
  const served = (await (await fetch(`http://localhost:${PORT}/test`)).text()).match(/MARKER_V\d/)[0]
  console.log(`\n== ${label} ==`)
  console.log(`  server HTML marker      : ${served}`)
  console.log(`  browser rendered marker : ${rendered}`)
  console.log(`  full document requests during click: ${docs.length ? docs.join(', ') : '(none - soft navigation)'}`)
  await ctx.close()
  return { rendered, served, docs }
}

fs.rmSync(PROFILE, { recursive: true, force: true })
fs.writeFileSync(PAGE, fs.readFileSync(PAGE, 'utf8').replace(/MARKER_V\d/, 'MARKER_V1'))
await run(process.execPath, ['node_modules/next/dist/bin/next', 'build'])
await start()
await visit('build 1 (fresh browser profile)')
await stop()

fs.writeFileSync(PAGE, fs.readFileSync(PAGE, 'utf8').replace(/MARKER_V\d/, 'MARKER_V2'))
await run(process.execPath, ['node_modules/next/dist/bin/next', 'build'])
await start()
const r = await visit('build 2 (same browser profile => same HTTP cache)')
await stop()

console.log('\n----------------------------------------')
if (r.rendered !== r.served || r.docs.length > 0) {
  console.log('REPRODUCED: stale RSC payload from the browser HTTP cache.')
  if (r.rendered !== r.served) console.log(` - rendered "${r.rendered}" but server serves "${r.served}"`)
  if (r.docs.length) console.log(' - router fell back to a full page reload (hard navigation)')
  process.exit(1)
} else {
  console.log('NOT reproduced: fresh content, soft navigation.')
}
