# next#81795 — Route Handler request body is buffered (dev only)

Minimal repro of https://github.com/vercel/next.js/issues/81795

`POST /api/stream` reads `request.body` chunk-by-chunk and logs each chunk with a timestamp.
A server-side `fetch()` (from an RSC render or a Server Action) sends a `ReadableStream`
body with 3 chunks, 1s apart.

## Run

```bash
npm install
npm run dev
curl http://localhost:3000/rsc     # server-side fetch from an RSC render (no browser needed)
```

Or open http://localhost:3000 and click "Start Stream" (the reporter's Server Action path).

## Observed (next dev)

```
[CLIENT] enqueue 1 at ...:27.514Z
[CLIENT] enqueue 2 at ...:28.519Z
[CLIENT] enqueue 3 at ...:29.521Z
--- [SERVER] Request handler invoked at ...:30.535Z ---
[SERVER] Chunk #1 received ...: "chunk 1\nchunk 2\nchunk 3"
--- [SERVER] Stream finished ---
```

The whole body is buffered: the handler is not invoked until the request stream closes and
receives a single chunk (`chunksReceived: 1`). `cache: "no-store"` does not help.

## Expected (and what `next start` does)

```bash
npm run build && npm start
curl http://localhost:3000/rsc
```

Chunks arrive one-by-one, `chunksReceived: 3`.

## Note

The buffering is done by the caller, not the route handler: Next's patched `fetch`
(`server/lib/patch-fetch.ts`) calls `incrementalCache.generateCacheKey()` whenever
`isCacheableRevalidate || serverComponentsHmrCache` is set. `generateCacheKey`
(`server/lib/incremental-cache/index.ts`) does `await readableBody.pipeTo(...)` and replaces
`init.body` with a fully-drained `Uint8Array` (`_ogBody`). `serverComponentsHmrCache` exists
only in dev, which is why prod streams correctly. A plain `node` script using global `fetch`
against the same dev route handler also streams correctly.
