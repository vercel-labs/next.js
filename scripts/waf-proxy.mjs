// Simulates an nginx/WAF-hardened CDN edge (block_common_exploits.conf) in front of
// `next start`: any request path containing `~` or `..` gets a canned block page
// instead of the real asset. Next 16.2.x (base40 hashes) emits chunk filenames
// containing those characters, so the browser hashes the block page body and the
// SRI check fails with "Failed to find a valid digest in the 'integrity' attribute".
import http from 'node:http'
const UPSTREAM = process.env.UPSTREAM || 'http://127.0.0.1:3000'
const PORT = Number(process.env.PORT || 3001)
http.createServer((req, res) => {
  if (/~|\.\./.test(req.url)) {
    const body = '<html><body><h1>403 Forbidden</h1></body></html>'
    res.writeHead(200, { 'content-type': 'text/html' })
    res.end(body)
    return
  }
  const p = http.request(UPSTREAM + req.url, { method: req.method, headers: req.headers }, (u) => {
    res.writeHead(u.statusCode, u.headers)
    u.pipe(res)
  })
  req.pipe(p)
}).listen(PORT, () => console.log('waf proxy on ' + PORT))
