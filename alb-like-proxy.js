// Minimal proxy that behaves like AWS ALB: APPENDS the real client IP to
// any incoming X-Forwarded-For header instead of replacing it.
const http = require('http')
const TARGET_PORT = 3000
http
  .createServer((req, res) => {
    const clientIp = req.socket.remoteAddress
    const incoming = req.headers['x-forwarded-for']
    const headers = {
      ...req.headers,
      host: `localhost:${TARGET_PORT}`,
      'x-forwarded-for': incoming ? `${incoming}, ${clientIp}` : clientIp,
    }
    const proxied = http.request(
      { host: '127.0.0.1', port: TARGET_PORT, path: req.url, method: req.method, headers },
      (r) => {
        res.writeHead(r.statusCode, r.headers)
        r.pipe(res)
      }
    )
    req.pipe(proxied)
  })
  .listen(4000, () => console.log('alb-like proxy on http://localhost:4000'))
