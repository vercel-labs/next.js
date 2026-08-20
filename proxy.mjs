// Minimal reverse proxy on :4000 -> Next.js on :3000
// Sends the standard forwarding headers a real proxy (nginx/Traefik) would send.
import http from 'node:http'

const UPSTREAM = { host: '127.0.0.1', port: 3000 }
const PUBLIC_HOST = 'proxy.example.com'

http
  .createServer((req, res) => {
    const headers = {
      ...req.headers,
      host: PUBLIC_HOST,
      'x-forwarded-host': PUBLIC_HOST,
      'x-forwarded-proto': 'https',
      'x-forwarded-port': '443',
    }
    const upstream = http.request(
      { ...UPSTREAM, method: req.method, path: req.url, headers },
      (r) => {
        res.writeHead(r.statusCode ?? 502, r.headers)
        r.pipe(res)
      }
    )
    upstream.on('error', (e) => {
      res.writeHead(502)
      res.end(String(e))
    })
    req.pipe(upstream)
  })
  .listen(4000, () => console.log('proxy on http://localhost:4000'))
