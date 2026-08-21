// Minimal static file server for `out/`.
// By default it serves .txt files WITHOUT a Content-Type header (like some
// generic/CDN static hosts). Pass --with-content-type to serve them as
// text/plain, which is the control case.
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'

const ROOT = join(import.meta.dirname, 'out')
const PORT = Number(process.env.PORT || 3000)
const WITH_CT = process.argv.includes('--with-content-type')

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

async function resolve(pathname) {
  const candidates = []
  if (pathname.endsWith('/')) {
    candidates.push(join(ROOT, pathname, 'index.html'))
  } else {
    candidates.push(join(ROOT, pathname))
    candidates.push(join(ROOT, pathname + '.html'))
    candidates.push(join(ROOT, pathname, 'index.html'))
  }
  for (const c of candidates) {
    try {
      const s = await stat(c)
      if (s.isFile()) return c
    } catch {}
  }
  return null
}

createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  const file = await resolve(pathname)
  if (!file) {
    res.writeHead(404, { 'content-type': 'text/html' })
    res.end('not found')
    console.log(`404 ${pathname}`)
    return
  }
  const body = await readFile(file)
  const ext = extname(file)
  const headers = {}
  if (ext === '.txt') {
    if (WITH_CT) headers['content-type'] = 'text/plain; charset=utf-8'
    // else: intentionally no Content-Type header at all
  } else if (TYPES[ext]) {
    headers['content-type'] = TYPES[ext]
  }
  res.writeHead(200, headers)
  res.end(body)
  console.log(
    `200 ${pathname} -> ${file.replace(ROOT, 'out')} content-type=${headers['content-type'] ?? '(none)'}`
  )
}).listen(PORT, () => {
  console.log(
    `static server on http://localhost:${PORT} (txt content-type: ${WITH_CT ? 'text/plain' : 'OMITTED'})`
  )
})
