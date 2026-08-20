// Plain Node HTTP server that reports what headers/body it actually received.
import http from 'node:http'

http
  .createServer((req, res) => {
    let body = ''
    req.on('data', (c) => (body += c))
    req.on('end', () => {
      console.log(
        JSON.stringify({
          url: req.url,
          method: req.method,
          'content-length': req.headers['content-length'] ?? null,
          'transfer-encoding': req.headers['transfer-encoding'] ?? null,
          body,
        })
      )
      res.setHeader('content-type', 'application/json')
      res.end(JSON.stringify({ ok: true, received: body }))
    })
  })
  .listen(4000, () => console.log('echo server on http://127.0.0.1:4000'))
