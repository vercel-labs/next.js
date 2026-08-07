// Simulated edge WAF / bot-management layer sitting in front of Next.js.
// Any request carrying `RSC: 1` (navigation + prefetch) or `next-action`
// (Server Action) gets a 403 text/html challenge instead of being forwarded.
import http from 'node:http'

const UPSTREAM = process.env.UPSTREAM || 'http://127.0.0.1:3000'
const PORT = Number(process.env.PORT || 3001)

const server = http.createServer((req, res) => {
  const rsc = req.headers['rsc']
  const action = req.headers['next-action']
  if (rsc !== undefined || action !== undefined) {
    console.log(
      `[waf] CHALLENGE 403 ${req.method} ${req.url} rsc=${rsc} next-action=${
        action !== undefined
      } accept=${req.headers['accept']}`
    )
    res.writeHead(403, { 'content-type': 'text/html; charset=utf-8' })
    res.end('<html><body><h1 id="challenge">Bot challenge</h1></body></html>')
    return
  }
  console.log(`[waf] pass ${req.method} ${req.url}`)
  const proxied = http.request(
    UPSTREAM + req.url,
    { method: req.method, headers: req.headers },
    (up) => {
      res.writeHead(up.statusCode, up.headers)
      up.pipe(res)
    }
  )
  proxied.on('error', (e) => {
    res.writeHead(502).end(String(e))
  })
  req.pipe(proxied)
})
server.listen(PORT, () => console.log(`[waf] listening on ${PORT} -> ${UPSTREAM}`))
