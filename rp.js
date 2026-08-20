// Minimal reverse proxy emulating IIS/nginx rewrite rules in front of `next start`.
// mode=strip : http://localhost:8080/test/x  ->  http://localhost:3000/x        (case 2 in the issue)
// mode=keep  : http://localhost:8080/test/x  ->  http://localhost:3000/test/x   (case 3 in the issue)
// mode=iis   : like keep, but the rewrite always emits a trailing slash for the root (`/test` -> `/test/`)
const http = require('http')

const mode = ['keep', 'strip', 'iis'].includes(process.argv[2]) ? process.argv[2] : 'strip'
const PORT = Number(process.env.PORT || 8080)
const UPSTREAM = { host: '127.0.0.1', port: Number(process.env.UPSTREAM_PORT || 3000) }

http
  .createServer((req, res) => {
    let path = req.url
    if (mode === 'strip') {
      path = req.url.replace(/^\/test(?=\/|$|\?)/, '') || '/'
    } else if (mode === 'iis') {
      // Typical IIS rule: match `test/(.*)` -> rewrite to `http://localhost:3000/test/{R:1}`
      // which always yields a trailing slash for the root request.
      const m = req.url.match(/^\/test\/?(.*)$/)
      if (m) path = '/test/' + m[1]
    }
    const headers = { ...req.headers, host: `localhost:${PORT}` }
    const upstream = http.request(
      { ...UPSTREAM, method: req.method, path, headers },
      (up) => {
        console.log(
          `[proxy ${mode}] ${req.method} ${req.url} -> :${UPSTREAM.port}${path} = ${up.statusCode}` +
            (up.headers.location ? ` location=${up.headers.location}` : '')
        )
        res.writeHead(up.statusCode, up.headers)
        up.pipe(res)
      }
    )
    upstream.on('error', (e) => {
      res.writeHead(502)
      res.end(String(e))
    })
    req.pipe(upstream)
  })
  .listen(PORT, () => console.log(`proxy(${mode}) on http://localhost:${PORT}`))
