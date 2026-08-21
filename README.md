# Repro: vercel/next.js#87012 — async Client Component causes infinite request loop

The reporter's repo (JsonLYH/next-core-demo) returns 404, so this is a minimal rebuild
with next@16.0.7 / react@19.2.0.

`app/(bug)/bug/page.js` is `'use client'` and `async`. `next build` succeeds with no
error or warning, but in the browser the async client component re-renders forever and
its `fetch('/api/data')` is re-issued in an infinite loop.

## Run

```bash
npm install
npm run build   # succeeds, no warning about the async client component
npm start
# open http://localhost:3000/bug and watch the Network tab / server stdout
```

Observed: ~5.5k `/api/data` requests in 5 seconds (Chromium eventually reports
`net::ERR_INSUFFICIENT_RESOURCES`); server stdout logs hundreds of hits.
