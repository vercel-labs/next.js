# Repro: stale `<title>` when navigating between dynamic routes (Next.js 16.3.0, `cacheComponents` + `partialPrefetching`)

Issue: https://github.com/vercel/next.js/issues/97417

## Run

```bash
npm install
npm run build && npm start   # http://localhost:3000
node test-title.mjs          # automated Playwright check (set CHROME_PATH if needed)
```

## Steps (manual)

1. Open `/`.
2. Click `bitcoin` -> `/coin/bitcoin`, tab title is `Bitcoin` (correct).
3. Click `home`.
4. Click `ethereum` -> `/coin/ethereum`.

Expected title `Ethereum`, actual title stays `Bitcoin`. A third visit (`solana`) shows `Ethereum`.

## Notes

- Only reproduces in a production build (`next build && next start`); `next dev` is fine.
- Requires `cacheComponents: true` + `partialPrefetching: true` (see `next.config.mjs`). Removing
  `partialPrefetching` makes the title correct.
- Requires the route content to be rendered by a client component that suspends after hydration
  (`app/coin/[id]/client-container.js` with `lazy()` + `Suspense`). Rendering plain server output
  in the same setup does not reproduce.
- The first hard load of any coin page is correct; only client-side navigations back into the same
  dynamic route with a different param keep the previously rendered page's title.
