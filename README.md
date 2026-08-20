# Reproduction: `cacheLife` with `revalidate` < 1 errors in production only (vercel/next.js#74660)

`next dev` renders fine, `next build` succeeds, but `next start` returns HTTP 500 with:

```
Error: Invalid revalidate configuration provided: 0.999 < 1
```

## Run

```bash
npm install
npm run dev   # http://localhost:3000 -> 200 "OK"
npm run build # succeeds, route "/" is static, Revalidate ≈1s
npm run start # http://localhost:3000 -> 500 Internal Server Error
```

Verified on `next@16.3.1-canary.25` (`experimental.cacheComponents`) and on the originally
reported `next@15.2.0-canary.1` (`experimental.dynamicIO`, `unstable_cacheLife`).

Thrown from `packages/next/src/server/base-server.ts`, where `cacheEntry.revalidate < 1` throws (error code E22).
