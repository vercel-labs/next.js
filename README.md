# Repro: `redirect()` after an `await` is silently dropped by client-side navigation with `cacheComponents`

Upstream issue: https://github.com/vercel/next.js/issues/97534

The reporter's gist (5 files) could not be used as-is: Gist cannot hold two files named
`page.tsx`, so `app/start/page.tsx` and `app/gated/page.tsx` were missing. Reconstructed here.

## Run

```
npm install
npx next build && npx next start
```

1. `curl -o /dev/null -w '%{http_code}' http://localhost:3000/gated` -> **200** (body carries
   `NEXT_REDIRECT;replace;/destination;307;`). Without `cacheComponents` it is **307**.
2. Open `/gated` directly -> lands on `/destination`. ✅
3. Open `/start` and click the link to `/gated` -> **stays on `/start`**. ❌
   Three RSC requests to `/gated?_rsc=...` return 200, no console error, no navigation.

`npm run verify` runs both navigation modes in Chromium via Playwright.
