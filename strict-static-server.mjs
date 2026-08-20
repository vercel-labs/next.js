// Static host that does NOT redirect /x -> /x/ (like Cloudflare Pages)
import http from 'http'
import fs from 'fs'
import path from 'path'

const root = path.join(process.cwd(), 'out')
http
  .createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0])
    let file = path.join(root, url)
    if (url.endsWith('/')) file = path.join(file, 'index.html')
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404)
      return res.end('404 (no such file): ' + url)
    }
    res.writeHead(200)
    res.end(fs.readFileSync(file))
  })
  .listen(3999, () => console.log('http://localhost:3999'))
