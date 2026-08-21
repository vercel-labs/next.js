// Upstream fixture: serves several response shapes to probe Next.js external rewrites.
const http = require('http')
const zlib = require('zlib')

const body = '// upstream script\n' + 'console.log("hello from upstream");\n'.repeat(50)
const gz = zlib.gzipSync(Buffer.from(body))
const br = zlib.brotliCompressSync(Buffer.from(body))

const handlers = {
  // 1. gzip with content-length
  '/gzip': (req, res) => {
    res.writeHead(200, {
      'content-type': 'application/javascript',
      'content-encoding': 'gzip',
      'content-length': String(gz.length),
    })
    res.end(gz)
  },
  // 2. gzip, chunked (no content-length)
  '/gzip-chunked': (req, res) => {
    res.writeHead(200, {
      'content-type': 'application/javascript',
      'content-encoding': 'gzip',
    })
    res.write(gz.subarray(0, 10))
    setTimeout(() => res.end(gz.subarray(10)), 20)
  },
  // 3. brotli
  '/br': (req, res) => {
    res.writeHead(200, {
      'content-type': 'application/javascript',
      'content-encoding': 'br',
      'content-length': String(br.length),
    })
    res.end(br)
  },
  // 4. plain
  '/plain': (req, res) => {
    res.writeHead(200, {
      'content-type': 'application/javascript',
      'content-length': String(Buffer.byteLength(body)),
    })
    res.end(body)
  },
  // 5. wrong content-length (too large) with gzip body
  '/bad-length': (req, res) => {
    res.writeHead(200, {
      'content-type': 'application/javascript',
      'content-encoding': 'gzip',
      'content-length': String(gz.length + 10),
    })
    res.end(gz)
  },
  // 6. connection: close
  '/close': (req, res) => {
    res.writeHead(200, {
      'content-type': 'application/javascript',
      'content-encoding': 'gzip',
      connection: 'close',
    })
    res.end(gz)
  },
  // 7. redirect
  '/redirect': (req, res) => {
    res.writeHead(302, { location: '/plain' })
    res.end()
  },
  // 8. abrupt socket destroy mid-body
  '/abort': (req, res) => {
    res.writeHead(200, { 'content-type': 'application/javascript', 'content-length': '9999' })
    res.write('// start\n')
    setTimeout(() => res.socket.destroy(), 30)
  },
}

http
  .createServer((req, res) => {
    const path = req.url.replace(/^\/+/, '/').split('?')[0]
    console.log(
      '[upstream]',
      req.method,
      req.url,
      'httpVersion=' + req.httpVersion,
      'accept-encoding=' + JSON.stringify(req.headers['accept-encoding'] || ''),
      'host=' + req.headers.host,
      'x-forwarded-host=' + (req.headers['x-forwarded-host'] || '-')
    )
    const h = handlers[path] || handlers['/plain']
    h(req, res)
  })
  .listen(4000, '127.0.0.1', () => console.log('upstream on 4000'))
