# Reproduction — vercel/next.js#70684

`_next/data` request for the pages-router **index** route gets a `308` redirect to the
basePath document when `basePath` + `middleware` are both configured.

Setup: `basePath: '/library'`, a pass-through `middleware.ts`, pages-router `/` (with
`getServerSideProps`) and `/other` containing a `<Link href="/">`.

## Run

```bash
npm install
npm run dev            # Turbopack (Next 16 default) — or: npm run dev:webpack
npm run check          # GET /library/_next/data/development/index.json
```

Production:

```bash
npm run build && npm start
BUILD_ID=$(cat .next/BUILD_ID) npm run check
```

## Result matrix (verified on Node 24, Linux)

| next | `/library/_next/data/<buildId>/index.json` |
| --- | --- |
| 15.0.0-canary.159 (reporter) | **308 → /library** (bug) |
| 14.2.35 | **308 → /library** (bug) |
| 15.1.12 / 15.3.9 / 15.4.7 | **308 → /library** (bug) |
| 15.5.0 / 15.5.23 | 200 (no redirect) |
| 16.3.1 (turbopack, webpack, next start) | 200 `application/json` |

So the redirect is fixed from 15.5.0 onwards; with `next@16.3.1` the pinned repro
scripts above return `200 {"pageProps":{"hello":"world"},"__N_SSP":true}` and
client-side navigation to `/` works with no console errors.

Note: for a *fully static* index page (no `getServerSideProps`/`getStaticProps`) the
`_next/data` response is served as `text/html` with `x-nextjs-matched-path`, on every
route (not just `/`), and the client router handles it — no redirect occurs.

To reproduce the original bug, pin an affected version, e.g.:

```bash
npm install next@15.4.7 react@18.3.1 react-dom@18.3.1
npx next dev -p 3001
curl -sD - -o /dev/null http://localhost:3001/library/_next/data/development/index.json
# HTTP/1.1 308 Permanent Redirect  /  location: /library
```
