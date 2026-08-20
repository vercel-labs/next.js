// Minimal OTLP/HTTP-JSON collector: prints one line per span.
import http from 'node:http'

http
  .createServer((req, res) => {
    let body = ''
    req.on('data', (c) => (body += c))
    req.on('end', () => {
      if (req.url?.startsWith('/v1/traces')) {
        try {
          const json = JSON.parse(body)
          for (const rs of json.resourceSpans ?? []) {
            for (const ss of rs.scopeSpans ?? []) {
              for (const span of ss.spans ?? []) {
                const attrs = Object.fromEntries(
                  (span.attributes ?? []).map((a) => [
                    a.key,
                    Object.values(a.value ?? {})[0],
                  ])
                )
                console.log(
                  JSON.stringify({
                    name: span.name,
                    traceId: span.traceId,
                    spanId: span.spanId,
                    parentSpanId: span.parentSpanId || null,
                    scope: ss.scope?.name,
                    'next.span_type': attrs['next.span_type'],
                    'next.bubble': attrs['next.bubble'],
                    'next.route': attrs['next.route'],
                    'http.target': attrs['http.target'],
                  })
                )
              }
            }
          }
        } catch (e) {
          console.error('parse error', e)
        }
      }
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end('{}')
    })
  })
  .listen(4318, () => console.log('collector listening on :4318'))
