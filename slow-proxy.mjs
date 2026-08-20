// Proxies http://localhost:3100 -> http://localhost:3000 and delays the
// /about page chunk by DELAY ms to emulate a slow network for that asset only.
import http from 'node:http'

const UPSTREAM = 'http://localhost:3000'
const DELAY = Number(process.env.DELAY ?? 8000)

http
  .createServer((req, res) => {
    const slow = /\/_next\/static\/chunks\/pages\/about-.*\.js$/.test(req.url)
    const forward = () => {
      const proxied = http.request(
        UPSTREAM + req.url,
        { method: req.method, headers: { ...req.headers, host: 'localhost:3000' } },
        (up) => {
          res.writeHead(up.statusCode, up.headers)
          up.pipe(res)
        }
      )
      proxied.on('error', (e) => {
        res.writeHead(502).end(String(e))
      })
      req.pipe(proxied)
    }
    if (slow) {
      console.log(`[slow-proxy] delaying ${req.url} by ${DELAY}ms`)
      setTimeout(forward, DELAY)
    } else {
      forward()
    }
  })
  .listen(3100, () => console.log('slow-proxy listening on http://localhost:3100'))
