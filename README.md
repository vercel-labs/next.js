# Repro: stale document.title on client navigation between dynamic-route params

Upstream issue: https://github.com/vercel/next.js/issues/97417

## Setup

```bash
npm install
npx playwright install chromium
npm run build
npx next start -p 3000
# in another shell
BASE=http://localhost:3000 node test.mjs
```

## Steps (manual)

1. Open `/`.
2. Click the `bitcoin` link -> tab title becomes `Bitcoin` (correct).
3. Click the `ethereum` link -> page content and URL update to `/coin/ethereum`, but the tab title stays `Bitcoin`.
4. Every further navigation keeps lagging one navigation behind.

## Actual (next@16.3.0, production build)

```
home | Home - repro
after nav to /coin/bitcoin | http://localhost:3000/coin/bitcoin | Bitcoin
after nav to /coin/ethereum | http://localhost:3000/coin/ethereum | Bitcoin
home again | Home - repro
nav bitcoin again | http://localhost:3000/coin/bitcoin | Ethereum
```

## Expected

Title should be `Ethereum` on `/coin/ethereum`.

## Notes

- Requires `cacheComponents: true` **and** `partialPrefetching: true` (see `next.config.js`).
  With `cacheComponents` alone the title updates correctly.
- Only reproduces in a production build (`next build && next start`); `next dev` is fine.
- Fixed in `next@16.3.1-canary.5`; last buggy version is `16.3.1-canary.4`.
