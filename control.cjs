require('./instrumentation-node.js')
const http = require('http')
const srv = http.createServer((req, res) => {
  console.log('[control] server saw traceparent?', 'traceparent' in req.headers)
  res.end('ok')
})
srv.listen(3999, () => {
  http.get('http://localhost:3999/', (res) => { res.resume(); res.on('end', () => srv.close()) })
})
