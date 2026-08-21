# Repro: nonce-based CSP inline `<head>` script vs `cacheComponents` (next#89754)

Next.js 16.1.5, `cacheComponents: true`, nonce generated in `proxy.ts` and read in the
root layout via `headers()` (the pattern from the official CSP docs).

## Variant 1 — `headers()` at layout top level (default)

```bash
npm install
npm run build
```

Fails:

```
Error: Route "/_not-found": Uncached data was accessed outside of <Suspense>.
    at head (<anonymous>)
    at html (<anonymous>)
```

## Variant 2 — `headers()` wrapped in `<Suspense>` inside `<head>`

```bash
VARIANT=suspense npm run build && VARIANT=suspense npm start
curl -s http://localhost:3000/ | grep -o 'blocking-polyfill'
```

Build succeeds, but the inline script is emitted inside `<div hidden id="S:0">`
*after* `<body>` and after the page content, then moved by React's streaming
runtime — so it no longer blocks rendering.
