# Repro: vercel/next.js#80050

Partially prerendered (PPR / cacheComponents) dynamic routes return 404 when the app is
built with `NODE_ENV=test`.

## Steps

```bash
npm install
npm run build:test   # NODE_ENV=test next build
npm start
curl -i http://localhost:3000/   # => HTTP/1.1 404
```

Control (same app, default `NODE_ENV=production`):

```bash
rm -rf .next && npm run build && npm start
curl -i http://localhost:3000/   # => HTTP/1.1 200
```

## Observed

- `next@16.0.0` and `next@15.4.0-canary.47`: `NODE_ENV=test` build => `/` and `/foo` return 404.
- `.next/prerender-manifest.json` `dynamicRoutes['/[[...slug]]'].fallback` is `false`
  for the `NODE_ENV=test` build vs `"/[[...slug]]"` for the production build.
- Cause: `supportsRoutePreGeneration = hadAllParamsGenerated || process.env.NODE_ENV === 'production'`
  in `next/dist/build/static-paths/app.js`, so with any other NODE_ENV the fallback mode
  becomes NOT_FOUND.
- Fixed on recent canaries (verified 16.3.1-canary.26 => 200), where the check is
  `!process.env.__NEXT_DEV_SERVER`.
