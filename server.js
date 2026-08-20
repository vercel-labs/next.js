// Minimal static server that mimics Tauri's asset protocol:
// it does NOT set a Content-Type header for the RSC payload (.txt / .rsc) files.
const http = require('http')
const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, 'out')
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
}

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0])
  const candidates = [url, url + '.html', url + '/index.html', url.replace(/\/$/, '') + '.html']
  let file = null
  for (const c of candidates) {
    const p = path.join(root, c)
    if (fs.existsSync(p) && fs.statSync(p).isFile()) { file = p; break }
  }
  if (!file) { res.statusCode = 404; res.end('not found'); return }
  const ext = path.extname(file)
  const type = types[ext]
  if (type) res.setHeader('Content-Type', type)
  // NOTE: no Content-Type for .txt (RSC payload) -> reproduces the Tauri behaviour
  console.log(req.method, url, '->', path.relative(root, file), 'content-type:', type || '(none)')
  fs.createReadStream(file).pipe(res)
}).listen(3123, () => console.log('serving out/ on http://localhost:3123'))
