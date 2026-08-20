const http = require('http')
const server = http.createServer((req, res) => {
  const port = req.url.startsWith('/b') ? 3002 : 3001
  const p = http.request({ host: '127.0.0.1', port, path: req.url, method: req.method, headers: req.headers }, (up) => {
    console.log(`[proxy->${port}] ${req.method} ${req.url} rsc=${req.headers['rsc']||'-'} tree=${req.headers['next-router-state-tree']?'YES':'-'} => ${up.statusCode} ct=${up.headers['content-type']}`)
    res.writeHead(up.statusCode, up.headers); up.pipe(res)
  })
  p.on('error', (e) => { res.writeHead(502); res.end(String(e)) })
  req.pipe(p)
})
server.listen(3000, () => console.log('proxy on 3000'))
