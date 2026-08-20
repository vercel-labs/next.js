# Repro attempt for vercel/next.js#59813 — CORS error when loading next/font/local cross-origin

`pages/index.js` and `pages/bar.js` each use `next/font/local`. `next.config.js` sets
`assetPrefix: http://localhost:3000` plus an `Access-Control-Allow-Origin` header (as in the issue),
and `host-b-server.js` re-serves the app's HTML from the foreign origin `http://localhost:3001`,
so every asset (CSS chunk + `.woff2`) is fetched cross-origin.

## Run

```bash
npm install
npx playwright install chromium
npm run build
npm start &          # Next.js on :3000
npm run host-b &     # foreign origin on :3001
npm run check        # loads http://localhost:3001/, clicks the <Link>, prints font status + all requests
```

## Result on next@canary (16.3.1-canary.25) and next@14.2.13

With the `Access-Control-Allow-Origin: http://localhost:3001` header from the issue, the woff2 and
both CSS chunks return 200 with the header applied, `document.fonts` reports `loaded`, and there is
no CORS error — the report does not reproduce.

```bash
ACAO= npm run build && ACAO= npm start   # no ACAO header at all
```
With no ACAO header the woff2 is blocked ("Access to font at ... blocked by CORS policy: No
'Access-Control-Allow-Origin' header") and the router's `fetch()` for the prefetched CSS chunk is
blocked too — but next@13.4.12 (the version the reporter calls good) behaves identically, so no
13.4.13 regression is observable.
