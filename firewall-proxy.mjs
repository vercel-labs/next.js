// Simulates a corporate firewall / captive portal that intercepts
// https://registry.npmjs.org and answers every request with an HTML block page
// using HTTP 200 (so `res.ok` is true in Next.js' getVersionInfo).
import { createServer } from 'node:https'
import { readFileSync } from 'node:fs'

const html = `<!DOCTYPE html>
<html><head><title>Blocked by corporate firewall</title></head>
<body>Access to this site is blocked by your network administrator.</body></html>
`

createServer(
  { key: readFileSync('./key.pem'), cert: readFileSync('./cert.pem') },
  (req, res) => {
    console.log('[firewall] intercepted', req.method, req.url)
    res.writeHead(200, { 'content-type': 'text/html' })
    res.end(html)
  }
).listen(443, '127.0.0.1', () => console.log('[firewall] listening on 443'))
