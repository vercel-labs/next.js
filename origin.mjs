// Minimal "origin server" that the middleware rewrites to.
import { createServer } from 'node:http'

createServer((req, res) => {
  res.setHeader('content-type', 'text/plain')
  res.setHeader('cache-control', 'private, no-store, origin-value')
  res.setHeader('server', 'origin-server')
  res.setHeader('x-origin-only', 'origin-value')
  res.end('hello from origin ' + req.url + '\n')
}).listen(4000, () => console.log('origin listening on http://localhost:4000'))
