// Custom dev server (next() + explicit upgrade handling), like the reporter's app.
// Logs every HTTP request and every /_next/hmr WebSocket upgrade so the endless
// reconnect loop is visible server-side without attaching a DevTools client
// (attaching one disables Chrome prerendering: PrerenderingDisabledByDevTools).
const http = require('http')
const next = require('next')

const app = next({ dev: true })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const upgradeHandler = app.getUpgradeHandler()
  let upgrades = 0

  const server = http.createServer((req, res) => {
    console.log(
      `[REQ] ${req.method} ${req.url} sec-purpose=${req.headers['sec-purpose'] || '-'}`
    )
    handle(req, res)
  })

  server.on('upgrade', (req, socket, head) => {
    if (req.url.startsWith('/_next/hmr')) {
      upgrades++
      console.log(`[HMR-UPGRADE #${upgrades}] ${req.url}`)
    }
    upgradeHandler(req, socket, head)
  })

  server.listen(3000, () => console.log('> ready on http://localhost:3000'))
})
