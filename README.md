# Repro: prefetched page is re-fetched when `router.push` runs inside a server-action form action

Issue: https://github.com/vercel/next.js/issues/77064

```bash
npm install
npx playwright install chromium
npm run build && npm start          # prefetch is a no-op in `next dev`, so use a production server
# in another shell:
npm run verify
```

`verify.mjs` drives Chromium and prints every RSC request for `/dashboard/my-new-board`:

- on input blur: 1 prefetch request (`Next-Router-Prefetch`), completes long before submit
- after submitting the form (server action resolves, then `router.push` to the *same* URL):
  1 additional non-prefetch RSC request for that URL — the prefetch entry is not reused

Set `PUSH_IN_TIMEOUT = true` in `app/page.tsx` to push in a macrotask instead: the extra request
disappears, so only pushing synchronously inside the server-action transition discards the prefetch.

Reproduced with next@15.2.2 and next@16.3.1-canary.26 (`next start`).
