# Repro: issue #80032 — `RangeError: Maximum call stack size exceeded` collecting page data with >~125k static params

`generateStaticParams` returning more than Node's max argument count (~125k) crashes
`next build` in `Collecting page data`, because Next spreads the result array into
`Array.prototype.push`:

`next/dist/build/static-paths/app.js` -> `params.push(...result)`
(canary: `nextParams.push(...result)`).

## Run

```bash
npm install
PAGE_COUNT=100000 npm run build   # succeeds
PAGE_COUNT=200000 npm run build   # RangeError: Maximum call stack size exceeded
```

Fails on next@15.3.2 and next@16.3.1-canary.26.
