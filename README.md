# Repro: vercel/next.js#83001

Patched `fetch` breaks `Request` with `mode: "no-cors"` in App Router dynamic routes:
`TypeError: If request is made from ReadableStream, mode should be "same-origin" or "cors"`

## Run

```bash
npm install
npm run dev   # then open http://localhost:3000/foo  -> 500 TypeError
npm run build # -> Failed to collect page data for /[pageId]
```

Control: `REPRO_MODE=without-request npm run dev` -> `/foo` returns 200 (plain
`fetch(url, init)` works; only `fetch(new Request(...))` fails).

Verified with next@16.3.1-canary.26 on Node 24.
