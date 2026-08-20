// Minimal stand-in for URL-rewriting proxies (EZproxy / translate.goog).
// MODE=headers  -> rewrites the upstream host inside *request headers*
//                  (this mangles the percent-encoded Next-Router-State-Tree header)
// MODE=body     -> rewrites the upstream host inside *HTML response bodies*
//                  while keeping the original content-length (EZproxy HJ/DJ style)
// MODE=decode   -> percent-decodes the Next-Router-State-Tree request header
// MODE=strip    -> drops Next.js RSC request headers
// MODE=passthru -> plain proxy, no rewriting (control)
import http from 'node:http'

const MODE = process.env.MODE || 'headers'
const UPSTREAM = process.env.UPSTREAM || 'localhost:3000'
const PORT = Number(process.env.PORT || 3999)
const SELF = `localhost:${PORT}`

const RSC_HEADERS = ['rsc', 'next-router-state-tree', 'next-router-prefetch', 'next-url']

const server = http.createServer((creq, cres) => {
  const headers = { ...creq.headers, host: UPSTREAM }
  if (MODE === 'strip') {
    for (const h of RSC_HEADERS) delete headers[h]
  }
  if (MODE === 'decode' && typeof headers['next-router-state-tree'] === 'string') {
    // many proxies normalize / percent-decode header values
    headers['next-router-state-tree'] = decodeURIComponent(headers['next-router-state-tree'])
  }
  if (MODE === 'headers') {
    for (const [k, v] of Object.entries(headers)) {
      if (k === 'host') continue
      if (typeof v === 'string' && v.includes(SELF)) {
        headers[k] = v.split(SELF).join(UPSTREAM)
      }
    }
  }

  if (MODE === 'body' || MODE === 'truncate') {
    // A rewriting proxy must read text, so it asks upstream for identity encoding
    delete headers['accept-encoding']
  }

  const preq = http.request(
    { host: 'localhost', port: Number(UPSTREAM.split(':')[1]), method: creq.method, path: creq.url, headers },
    (pres) => {
      const isHtml = /text\/html/.test(pres.headers['content-type'] || '')
      if ((MODE === 'body' || MODE === 'truncate') && isHtml) {
        const chunks = []
        pres.on('data', (c) => chunks.push(c))
        pres.on('end', () => {
          const original = Buffer.concat(chunks)
          // naive URL rewrite, like a proxy that rewrites absolute URLs / JS in HTML
          let out = original.toString('utf8').split(UPSTREAM).join(SELF)
          if (MODE === 'truncate') {
            // proxy drops the tail of the streamed document (last flight chunks)
            out = out.slice(0, Math.floor(out.length * 0.9))
          }
          const buf = Buffer.from(out, 'utf8')
          const h = { ...pres.headers }
          delete h['content-encoding']
          delete h['transfer-encoding']
          h['content-length'] = String(buf.length)
          cres.writeHead(pres.statusCode, h)
          cres.end(buf)
        })
        return
      }
      cres.writeHead(pres.statusCode, pres.headers)
      pres.pipe(cres)
    }
  )
  preq.on('error', (e) => {
    cres.writeHead(502)
    cres.end('proxy error: ' + e.message)
  })
  creq.pipe(preq)
})

server.listen(PORT, () => console.log(`[proxy MODE=${MODE}] http://localhost:${PORT} -> http://${UPSTREAM}`))
