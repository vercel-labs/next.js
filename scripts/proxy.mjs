// Minimal "deployment skew" proxy in front of `next start`.
//
// After GET /__flip, the proxy rewrites x-nextjs-deployment-id to a NEW value
// on *dynamic navigation* RSC responses only (requests with `rsc: 1` and no
// prefetch header). This models the issue's scenario exactly: the static shell
// was prefetched from the OLD deployment and is already in the segment cache,
// and the mismatch is only discovered on the dynamic fill of the navigation.
import http from 'node:http'

const PORT = Number(process.env.PROXY_PORT || 3100)
const UPSTREAM = Number(process.env.UPSTREAM_PORT || 3000)
const NEW_ID = 'deployment-NEW'
const MODE = process.env.SKEW_MODE || 'dynamic-only' // 'dynamic-only' | 'all'

let flipped = false

const server = http.createServer((req, res) => {
  if (req.url === '/__flip') {
    flipped = true
    res.writeHead(200, { 'content-type': 'text/plain' })
    res.end('flipped')
    console.log('[proxy] FLIPPED: dynamic RSC responses now report', NEW_ID)
    return
  }
  const isRsc = req.headers['rsc'] === '1'
  const isPrefetch =
    req.headers['next-router-prefetch'] !== undefined ||
    req.headers['next-router-segment-prefetch'] !== undefined
  const proxyReq = http.request(
    { host: '127.0.0.1', port: UPSTREAM, path: req.url, method: req.method, headers: req.headers },
    (proxyRes) => {
      const headers = { ...proxyRes.headers }
      const shouldRewrite =
        flipped &&
        headers['x-nextjs-deployment-id'] &&
        (MODE === 'all' || (isRsc && !isPrefetch))
      if (shouldRewrite) headers['x-nextjs-deployment-id'] = NEW_ID
      console.log(
        `[proxy] ${req.method} ${req.url} rsc=${isRsc} prefetch=${isPrefetch} ` +
          `segPrefetch=${req.headers['next-router-segment-prefetch'] ?? '-'} ` +
          `-> ${proxyRes.statusCode} depId=${headers['x-nextjs-deployment-id'] ?? '-'}` +
          (shouldRewrite ? ' (REWRITTEN)' : '')
      )
      res.writeHead(proxyRes.statusCode || 200, headers)
      proxyRes.pipe(res)
    }
  )
  proxyReq.on('error', (err) => {
    res.writeHead(502)
    res.end(String(err))
  })
  req.pipe(proxyReq)
})
server.listen(PORT, () => console.log(`[proxy] http://localhost:${PORT} -> upstream ${UPSTREAM} mode=${MODE}`))
