# Repro: next.js#62201 — `compress: true` buffers a proxied streaming response

Minimal reproduction of https://github.com/vercel/next.js/issues/62201.
The reporter's FastAPI `StreamingResponse` is replaced by a 30-line Node server
(`scripts/upstream-server.js`) that emits one JSON line every 300ms, so no
Python is needed. Next.js proxies it through a `rewrites()` entry, exactly like
the original repro.

## Run

```bash
npm install
npm run repro     # starts upstream + next dev (compress on and off) and probes both
```

Manual variant:

```bash
npm run upstream                      # :8000 upstream stream
npm run dev                           # :3000 next dev, compress: true (default)
node scripts/probe.js 3000 gzip       # browser-like Accept-Encoding: gzip
node scripts/probe.js 3000 identity   # no gzip
COMPRESS=false npm run dev            # compress: false
```

Open http://localhost:3000 and click **stream** to see it in a browser.

## Observed (next@16.3.1-canary.25 and next@14.1.0, dev and `next start`)

| request | content-encoding | chunks delivered to client |
| --- | --- | --- |
| direct to upstream :8000 | none | 10, one every ~300ms |
| through Next, `Accept-Encoding: gzip` | gzip | **1, all at ~3.3s (end of stream)** |
| through Next, `Accept-Encoding: identity` | none | 10, one every ~300ms |
| through Next with `compress: false` | none | 10, one every ~300ms |

Next's `compression` middleware (`server/lib/router-server.ts`) gzips the
proxied response but never flushes zlib per upstream chunk, so the client only
gets data when the stream ends. Because browsers always send
`Accept-Encoding: gzip`, streaming appears broken until `compress: false`.

Side note: an upstream `Cache-Control: no-transform` header makes the
compression middleware skip the response and streaming works; FastAPI does not
set it.
