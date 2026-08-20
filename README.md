# Repro: useSearchParams() should be wrapped in a suspense boundary (vercel/next.js#74494)

`app/test/page.js` is a `"use client"` page that calls `useSearchParams()` with no
`<Suspense>` boundary. `next build` fails while prerendering `/test`.

## Run

```bash
npm install
npm run build   # fails
npm run dev     # works: GET /test?q=hello -> 200, no error
```

## Observed

```
⨯ useSearchParams() should be wrapped in a suspense boundary at page "/test".
  Read more: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
Error occurred prerendering page "/test".
Export encountered an error on /test/page: /test, exiting the build.
⨯ Next.js build worker exited with code: 1 and signal: null
```

Reproduced on next@15.1.3 (webpack) and next@16.3.1-canary.25 (Turbopack).
Setting `experimental.missingSuspenseWithCSRBailout: false` (suggested by the linked
error docs page for v14) is rejected: "Unrecognized key(s) in object:
'missingSuspenseWithCSRBailout' at experimental" and the build still fails.
