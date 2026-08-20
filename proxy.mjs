// Minimal "proxy layer" in front of Next.js that rewrites (decrypts) a value
// in the outgoing HTML *and* in the RSC (flight) payload, as described in the issue.
import http from 'node:http'

const UPSTREAM = 'http://127.0.0.1:3000'
const FROM = 'LONG_ENCRYPTED_'
const TO = 'decrypted-value-of-different-length_' // different length on purpose (real decryption changes length)

const server = http.createServer(async (req, res) => {
  const upstream = await fetch(UPSTREAM + req.url, {
    method: req.method,
    headers: { ...req.headers, host: '127.0.0.1:3000', 'accept-encoding': 'identity' },
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : req,
    duplex: 'half',
    redirect: 'manual',
  })
  const ct = upstream.headers.get('content-type') || ''
  const rewritable = ct.includes('text/html') || ct.includes('text/x-component')
  const headers = {}
  upstream.headers.forEach((v, k) => {
    if (k === 'content-encoding' || k === 'content-length' || k === 'transfer-encoding') return
    headers[k] = v
  })
  if (!rewritable) {
    res.writeHead(upstream.status, headers)
    res.end(Buffer.from(await upstream.arrayBuffer()))
    return
  }
  let body = await upstream.text()
  const hits = body.split(FROM).length - 1
  body = body.split(FROM).join(TO)
  console.log(`[proxy] ${req.method} ${req.url} ct=${ct} substitutions=${hits}`)
  res.writeHead(upstream.status, headers)
  res.end(body)
})
server.listen(3100, () => console.log('[proxy] listening on http://127.0.0.1:3100'))
