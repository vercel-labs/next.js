# Repro: notFound boundary not reset when only search params change (vercel/next.js#69622)

Minimal app reproducing https://github.com/vercel/next.js/issues/69622 on Next.js canary.

## Run

```bash
npm install
npm run dev   # http://localhost:3001
# or: npm run build && npm run start  # http://localhost:3002
```

## Steps

1. Open `/about` -> renders `about`.
2. Click the `/about?q=404` button -> the `not-found.jsx` boundary renders (`error 404`). Correct.
3. Click the `/about` button -> URL becomes `/about`, the server re-renders the page
   (`rendering about {}` is logged, RSC payload contains no NEXT_NOT_FOUND), but the client
   still shows `error 404`.
4. Navigating to `/` and back to `/about`, or a hard reload, clears the boundary.

Verified reproducing on `next@16.3.1-canary.25` in both `next dev` and `next start`,
and on the reporter's pinned `next@15.0.0-canary.139`.
