/**
 * Minimal emulation of the Vercel edge/CDN + serverless function split:
 *
 *  - prerendered App Router routes are served as the *static build artifacts*
 *    produced by `next build` (`.next/server/app/index.html` / `index.rsc`),
 *    exactly like Vercel serves prerendered output from the network layer,
 *  - every other request (dynamic routes, server actions) is forwarded to a
 *    Next.js server started in minimal mode with a *different*
 *    NEXT_DEPLOYMENT_ID, emulating the same artifact being served under a new
 *    deployment id (experimental.runtimeServerDeploymentId).
 */
const http = require('http')
const fs = require('fs')
const path = require('path')

const DIST = path.join(process.cwd(), '.next')
const UPSTREAM_PORT = Number(process.env.UPSTREAM_PORT || 3001)
const PORT = Number(process.env.PORT || 3100)

// routes are prerendered at build time -> served from the network layer
const PRERENDERED = new Set(['/'])

const routesManifest = JSON.parse(
  fs.readFileSync(path.join(DIST, 'routes-manifest.json'), 'utf8')
)
// the build-time deployment id header rule that `next build` bakes into
// routes-manifest.json (used by the CDN for prerendered RSC payloads)
const buildTimeDeploymentIdHeader =
  [...(routesManifest.onMatchHeaders || []), ...(routesManifest.headers || [])]
    .flatMap((h) => h.headers)
    .find((h) => h.key === 'x-nextjs-deployment-id')?.value ??
  routesManifest.deploymentId

const MIME = {
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
}

function isRSC(req) {
  return req.headers['rsc'] === '1'
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const pathname = url.pathname

  if (pathname.startsWith('/_next/static/')) {
    const file = path.join(DIST, pathname.replace('/_next/', ''))
    if (fs.existsSync(file)) {
      res.setHeader(
        'content-type',
        MIME[path.extname(file)] || 'application/octet-stream'
      )
      return fs.createReadStream(file).pipe(res)
    }
    res.statusCode = 404
    return res.end('not found')
  }

  if (PRERENDERED.has(pathname) && req.method === 'GET') {
    const file = path.join(
      DIST,
      'server/app',
      (pathname === '/' ? 'index' : pathname) + (isRSC(req) ? '.rsc' : '.html')
    )
    const body = fs.readFileSync(file)
    if (isRSC(req)) {
      res.setHeader('content-type', 'text/x-component')
      if (buildTimeDeploymentIdHeader) {
        res.setHeader('x-nextjs-deployment-id', buildTimeDeploymentIdHeader)
      }
    } else {
      res.setHeader('content-type', 'text/html; charset=utf-8')
    }
    res.setHeader('x-cdn', 'prerendered-artifact')
    return res.end(body)
  }

  // forward to the Next.js server ("serverless function" of the new deployment)
  const proxyReq = http.request(
    {
      host: '127.0.0.1',
      port: UPSTREAM_PORT,
      method: req.method,
      path: req.url,
      headers: { ...req.headers, 'x-matched-path': pathname },
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers)
      proxyRes.pipe(res)
    }
  )
  proxyReq.on('error', (err) => {
    res.statusCode = 502
    res.end('upstream error: ' + err.message)
  })
  req.pipe(proxyReq)
})

server.listen(PORT, () => {
  console.log(
    `cdn emulator on http://localhost:${PORT} (build-time deployment id header: ${buildTimeDeploymentIdHeader})`
  )
})
