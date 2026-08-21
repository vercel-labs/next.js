/**
 * Probe for https://github.com/vercel/next.js/issues/86835
 *
 * Shows that Chrome DevTools only requests Next.js' automatic-workspace-folder
 * endpoint (/.well-known/appspecific/com.chrome.devtools.json) for *loopback*
 * origins, and that Next dev answers it with the bare project root (node_modules
 * and .next included). DevTools then auto-connects that folder as a workspace,
 * so "Search in sources" (Cmd/Ctrl+Shift+F) walks the whole directory.
 *
 * Usage: `npm run dev` in one shell, then `node scripts/devtools-workspace-probe.mjs`
 */
import http from 'node:http'
import fs from 'node:fs'
import os from 'node:os'
import { chromium } from 'playwright'

const TARGET = 3000
const PROXY = 3002
const lanIp = Object.values(os.networkInterfaces())
  .flat()
  .find((i) => i && i.family === 'IPv4' && !i.internal)?.address

const seen = []
const proxy = http.createServer((req, res) => {
  seen.push(`${req.headers.host} ${req.method} ${req.url}`)
  const up = http.request(
    {
      host: '127.0.0.1',
      port: TARGET,
      path: req.url,
      method: req.method,
      headers: { ...req.headers, host: `localhost:${TARGET}` },
    },
    (r) => {
      res.writeHead(r.statusCode, r.headers)
      r.pipe(res)
    }
  )
  up.on('error', (e) => {
    res.writeHead(502)
    res.end(String(e))
  })
  req.pipe(up)
})
await new Promise((r) => proxy.listen(PROXY, '0.0.0.0', r))

const workspace = await (
  await fetch(
    `http://localhost:${PROXY}/.well-known/appspecific/com.chrome.devtools.json`
  )
).json()
console.log('devtools.json ->', JSON.stringify(workspace))

const root = workspace.workspace.root
let files = 0
let bytes = 0
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = `${d}/${e.name}`
    if (e.isDirectory()) walk(p)
    else if (e.isFile()) {
      files++
      try {
        bytes += fs.statSync(p).size
      } catch {}
    }
  }
}
walk(root)
console.log(
  `workspace root advertised to DevTools: ${root} (${files} files, ${(
    bytes /
    1024 /
    1024
  ).toFixed(0)} MB — includes node_modules/.next)`
)

const browser = await chromium.launch({
  headless: false,
  args: ['--auto-open-devtools-for-tabs', '--no-sandbox'],
})
for (const origin of [
  `http://localhost:${PROXY}`,
  lanIp ? `http://${lanIp}:${PROXY}` : null,
].filter(Boolean)) {
  const page = await browser.newPage()
  console.log(`opening ${origin} with DevTools auto-opened...`)
  await page.goto(`${origin}/`).catch((e) => console.log('goto:', e.message))
  await page.waitForTimeout(12000)
  await page.close().catch(() => {})
}
await browser.close()
proxy.close()

for (const origin of ['localhost', lanIp].filter(Boolean)) {
  const hit = seen.filter(
    (l) => l.startsWith(`${origin}:`) && l.includes('com.chrome.devtools.json')
  ).length
  console.log(
    `${origin}: devtools.json requested ${hit} time(s) -> workspace ${
      hit ? 'CONNECTED (search walks whole project)' : 'not connected'
    }`
  )
}
