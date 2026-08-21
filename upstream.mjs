import http from 'node:http'
let n = 0
http.createServer((req, res) => {
  n++
  console.log(`[upstream] HIT #${n} ${req.method} ${req.url} @ ${new Date().toISOString()}`)
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify({ path: req.url, value: `v${n}`, at: Date.now() }))
}).listen(4000, () => console.log('[upstream] listening on 4000'))
