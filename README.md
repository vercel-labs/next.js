# Repro: next.js#73695 — App Router route handler responses are not gzipped

`next start` (and `next dev`) gzip HTML pages and static assets when the client sends
`Accept-Encoding: gzip`, but App Router route handler (`app/api/*/route.js`) responses are
returned uncompressed with no `Content-Encoding` header. A manually gzipped body with an
explicit `Content-Encoding: gzip` header also has that header stripped.

## Run

```bash
npm install
npm run build && npm run start   # or: npm run dev
curl -sD - -o /dev/null -H 'Accept-Encoding: gzip' http://localhost:3100/          # Content-Encoding: gzip
curl -sD - -o /dev/null -H 'Accept-Encoding: gzip' http://localhost:3100/api/example      # no Content-Encoding
curl -sD - -o /dev/null -H 'Accept-Encoding: gzip' http://localhost:3100/api/manual-gzip  # Content-Encoding stripped
```
