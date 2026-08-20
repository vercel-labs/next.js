// Minimal simulation of S3 website hosting: redirects /path -> /path/ and DROPS the query string.
// Demonstrates that the query loss reported in vercel/next.js#24483 happens at the host layer.
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'

const root = path.join(process.cwd(), 'out')
http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost')
    const p = url.pathname
    if (!p.endsWith('/') && !path.extname(p) && fs.existsSync(path.join(root, p, 'index.html'))) {
      res.writeHead(301, { Location: p + '/' }) // S3-like: query string dropped
      return res.end()
    }
    const file = path.join(root, p.endsWith('/') ? p + 'index.html' : p)
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      res.writeHead(200, { 'content-type': file.endsWith('.html') ? 'text/html' : 'application/octet-stream' })
      return res.end(fs.readFileSync(file))
    }
    res.writeHead(404).end('not found')
  })
  .listen(3006, () => console.log('s3-sim on http://localhost:3006'))
