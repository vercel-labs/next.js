# Repro: middleware/proxy makes `_next/data` prefetch responses return `{}` (vercel/next.js#52515)

Pages Router page with `getServerSideProps` + a root `middleware.js` that only does `NextResponse.next()`.

## Run

```bash
npm install
npm run build
npm start          # production server on :3000
# in another shell:
curl -s -D- "http://localhost:3000/_next/data/$(cat .next/BUILD_ID)/track/1.json?id=1"
curl -s -D- -H 'x-middleware-prefetch: 1' "http://localhost:3000/_next/data/$(cat .next/BUILD_ID)/track/1.json?id=1"
```

Optional end-to-end browser check (needs `npx playwright install chromium`):

```bash
npm run check
```

## Observed (next@16.3.1-canary.25)

Without the header: `200 {"pageProps":{"data":"track1"},"__N_SSP":true}` with an ETag.

With `x-middleware-prefetch: 1` (which the client sends for `next/link` prefetches when
middleware/proxy exists): `200 {}` plus `x-middleware-skip: 1` and
`cache-control: private, no-cache, no-store, max-age=0, must-revalidate`.

`npm run check` shows the browser prefetch request carrying `x-middleware-prefetch: 1` and
receiving `{}`, while the click navigation (no header) receives the real props — so a shared
cache/CDN can store the empty payload.

Source of the bail-out: `next/dist/server/base-server.js` — `if (!isSSG && req.headers['x-middleware-prefetch'] && ...) res.body('{}').send()`.
