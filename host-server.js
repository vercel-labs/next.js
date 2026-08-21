// Serves a cross-site host page (127.0.0.1:8080) that iframes the Next dev
// server (localhost:3000). localhost and 127.0.0.1 are different sites, so the
// iframe is a third-party/cross-site context.
const http = require('http')
const page = `<!doctype html>
<html><body>
<h1>Host page (cross-site)</h1>
<iframe id="f" src="http://localhost:3000/" width="800" height="400"></iframe>
</body></html>`
http
  .createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' })
    res.end(page)
  })
  .listen(8080, '127.0.0.1', () => console.log('host page on http://127.0.0.1:8080'))
