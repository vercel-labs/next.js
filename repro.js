// Reproduces the undocumented Pages Router version-skew behavior added in
// Next.js 16.2 (#89325): with `deploymentId` configured, a /_next/data response
// from a server on a different deployment forces a hard reload (full page load)
// instead of a client-side navigation.
//
// Setup: two production builds of the same Pages Router app, one with
// deploymentId=deploy-old, one with deploymentId=deploy-new, behind a
// "load balancer" (proxy on :3000) that serves HTML/assets from the old pod
// and routes the /_next/data request to the new pod.
const { spawn } = require('node:child_process')
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

const LOG_DIR =
  process.env.LOG_DIR || path.join(__dirname, 'logs')
fs.mkdirSync(LOG_DIR, { recursive: true })

const NO_DPL = process.argv.includes('--no-deployment-id')
const OLD = NO_DPL ? { dpl: undefined, dist: '.next-old-nodpl' } : { dpl: 'deploy-old', dist: '.next-old' }
const NEW = NO_DPL ? { dpl: undefined, dist: '.next-new-nodpl' } : { dpl: 'deploy-new', dist: '.next-new' }

const children = []
function startServer(name, dpl, distDir, port) {
  const out = fs.openSync(path.join(LOG_DIR, `${name}.log`), 'w')
  const cp = spawn(
    process.execPath,
    [require.resolve('next/dist/bin/next'), 'start', '-p', String(port)],
    {
      cwd: __dirname,
      env: { ...process.env, ...(dpl ? { DPL: dpl } : {}), DIST_DIR: distDir },
      stdio: ['ignore', out, out],
    }
  )
  children.push(cp)
  return cp
}

function proxy(req, res) {
  const toNew = req.url.startsWith('/_next/data/')
  const port = toNew ? 3002 : 3001
  const p = http.request(
    { host: '127.0.0.1', port, path: req.url, method: req.method, headers: req.headers },
    (up) => {
      if (toNew) {
        console.log(
          '[lb] /_next/data ->  new pod, x-nextjs-deployment-id:',
          up.headers['x-nextjs-deployment-id']
        )
      }
      res.writeHead(up.statusCode, up.headers)
      up.pipe(res)
    }
  )
  p.on('error', (e) => {
    res.writeHead(502)
    res.end(String(e))
  })
  req.pipe(p)
}

const waitFor = async (url) => {
  for (let i = 0; i < 120; i++) {
    try {
      const r = await fetch(url)
      if (r.status) return
    } catch {}
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error('server never came up: ' + url)
}

;(async () => {
  const tag = NO_DPL ? '-no-dpl' : ''
  console.log('mode:', NO_DPL ? 'control (deploymentId unset)' : 'deploymentId configured')
  startServer('next-old-pod' + tag, OLD.dpl, OLD.dist, 3001)
  startServer('next-new-pod' + tag, NEW.dpl, NEW.dist, 3002)
  const lb = http.createServer(proxy).listen(3000)
  children.push({ kill: () => lb.close() })
  await waitFor('http://127.0.0.1:3001/')
  await waitFor('http://127.0.0.1:3002/')

  const { chromium } = require('playwright')
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const reloads = []
  page.on('console', (m) => console.log('[browser]', m.type(), m.text()))
  page.on('framenavigated', (f) => {
    if (f === page.mainFrame()) reloads.push(f.url())
  })

  await page.goto('http://localhost:3000/', { waitUntil: 'load' })
  // marker survives a client-side navigation, dies on a full page load
  await page.evaluate(() => {
    window.__clientSideMarker = 'alive'
  })
  await page.click('#to-other')
  await page.waitForSelector('#other')
  const marker = await page.evaluate(() => window.__clientSideMarker ?? null)

  console.log('\n--- result ---')
  console.log('main-frame navigations:', reloads)
  console.log('window.__clientSideMarker after navigation:', marker)
  console.log(
    marker === null
      ? 'HARD NAVIGATION (full page load) -> version-skew behavior reproduced'
      : 'soft (client-side) navigation -> NOT reproduced'
  )
  await page.screenshot({
    path: path.join(LOG_DIR, `after-navigation${NO_DPL ? '-no-dpl' : ''}.png`),
    fullPage: true,
  })
  await browser.close()
  for (const c of children) c.kill()
  const expectHard = !NO_DPL
  const ok = expectHard ? marker === null : marker === 'alive'
  console.log(ok ? 'EXPECTED for this mode' : 'UNEXPECTED for this mode')
  process.exit(ok ? 0 : 1)
})().catch(async (e) => {
  console.error(e)
  for (const c of children) c.kill()
  process.exit(2)
})
