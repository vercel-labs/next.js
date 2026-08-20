# Reproduction: vercel/next.js#66526 — `ChunkLoadError: Loading chunk app/layout failed` in `next dev`

Mirror/repair of the reporter's repo (https://github.com/Intellyse/next-js-bug) plus a
deterministic probe. Clerk keys are dummy values in `.env.local` (no real Clerk account
is needed — the middleware only has to answer the first request).

## Run

```bash
npm install
npm run probe      # cold-starts `next dev`, requests "/", then requests the layout chunk 5x
```

`npm run probe` exits non-zero when the dev server answers
`/_next/static/chunks/app/layout.js` with something that is not a complete JS chunk.

## Observed (next 14.2.3, node 24, clean `.next`)

```
 ✓ Compiled /_not-found in 2.9s (808 modules)
 GET /_next/static/chunks/app/layout.js 404 in 3224ms
[probe] req#1 status=404 ... received=9360 (HTML 404 page)   <-- BROKEN CHUNK
[probe] req#2 status=200 ... received=0                      <-- BROKEN CHUNK (empty body)
 ✓ Compiled in 375ms (381 modules)
[probe] req#3..5 status=200 received=1809073                 (complete)
```

With `curl` the same cold start also produced a 200 response whose body was cut at
131072 bytes while `Content-Length: 1808981` was advertised — i.e. the still-being-written
file is streamed to the browser, which is what produces
`Uncaught SyntaxError: Invalid or unexpected token` followed by
`Uncaught ChunkLoadError: Loading chunk app/layout failed`. A reload "fixes" it.

Only the first (cold) page load is affected; delete `.next` before each attempt.
