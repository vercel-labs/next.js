// Minimal ESI-capable proxy in front of `next dev` (port 3000).
// Mimics Varnish / Cloudflare Worker / Lambda@Edge ESI processing by replacing
// <esi:include src="..."></esi:include> in the HTML before it reaches the browser.
// WebSocket upgrades (Next.js HMR) are tunnelled through untouched.
const http = require('http')
const net = require('net')

const UPSTREAM_HOST = '127.0.0.1'
const UPSTREAM_PORT = 3000
const PORT = 3001

const server = http.createServer((req, res) => {
  const proxyReq = http.request(
    {
      host: UPSTREAM_HOST,
      port: UPSTREAM_PORT,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        host: `${UPSTREAM_HOST}:${UPSTREAM_PORT}`,
        'accept-encoding': 'identity',
      },
    },
    (upstream) => {
      const isHtml = (upstream.headers['content-type'] || '').includes('text/html')
      if (!isHtml) {
        res.writeHead(upstream.statusCode, upstream.headers)
        upstream.pipe(res)
        return
      }
      const chunks = []
      upstream.on('data', (c) => chunks.push(c))
      upstream.on('end', () => {
        const body = Buffer.concat(chunks)
          .toString('utf8')
          .replace(/<esi:include src="foo\.bar"><\/esi:include>/g, '<div>foobar</div>')
        const headers = { ...upstream.headers }
        delete headers['content-length']
        delete headers['transfer-encoding']
        res.writeHead(upstream.statusCode, headers)
        res.end(body)
      })
    }
  )
  proxyReq.on('error', (e) => {
    if (!res.headersSent) res.writeHead(502)
    res.end('proxy error: ' + e.message)
  })
  req.pipe(proxyReq)
})

// Pass through HMR websockets so Fast Refresh can connect via the proxy.
server.on('upgrade', (req, socket, head) => {
  const upstream = net.connect(UPSTREAM_PORT, UPSTREAM_HOST, () => {
    upstream.write(
      `${req.method} ${req.url} HTTP/1.1\r\n` +
        Object.entries({ ...req.headers, host: `${UPSTREAM_HOST}:${UPSTREAM_PORT}` })
          .map(([k, v]) => `${k}: ${v}\r\n`)
          .join('') +
        '\r\n'
    )
    if (head && head.length) upstream.write(head)
    upstream.pipe(socket)
    socket.pipe(upstream)
  })
  upstream.on('error', () => socket.destroy())
  socket.on('error', () => upstream.destroy())
})

server.listen(PORT, () => console.log('ESI proxy listening on http://localhost:' + PORT))
