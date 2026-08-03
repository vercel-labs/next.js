# Repro: `experimental.testProxy` recurses on non-test server-side HTTP requests (vercel/next.js#96521)

Since the vendored `@mswjs/interceptors` bump to 0.41.9 (socket-level interception),
`handleFetch()`'s `!testInfo` passthrough branch in
`next/dist/experimental/testmode/fetch.js` calls `originalFetch(request)`, which is
intercepted again by the same `ClientRequestInterceptor`, recursing indefinitely.
The `next-test-internal` guard only covers the proxy-protocol request path.

## 1. Standalone (fastest, deterministic)

```bash
npm install
node --max-old-space-size=400 repro.mjs
```

- next@16.3.0 / 16.3.0-canary.106 / 16.3.0-preview.10 →
  `RECURSION — passthrough originalFetch() called 201 times ...` (exit 1)
- next@16.3.0-preview.9 → `OK 200 {"ok":true} (originalFetch calls: 1)`

## 2. Real app (`experimental.testProxy: true`)

```bash
npm install
NODE_OPTIONS=--max-old-space-size=600 npm run dev
curl http://localhost:3000/
```

`app/page.js` makes one server-side `node:https` request to `https://example.com/`.
The request never settles; the dev server allocates until
`FATAL ERROR: ... JavaScript heap out of memory` and dies. `curl` returns nothing.
Without `experimental.testProxy` (or on `16.3.0-preview.9`) the page renders normally.
