# Reproduction attempt for vercel/next.js#86182

"Navigation to routes is blocked/delayed until prefetch requests complete in Next.js 16 with CacheComponents"

The reporter's linked repo (jperezr21/next-16-issue @ 1d2fc6e) contains only the bug template
(`/`, `/page1`, `/page2`), no `/c/brands` route and no `cacheComponents`, so it cannot show the
reported behavior. This is a minimal app that models the description: a home page with nav links
and a slow (5s) dynamic `/c/brands` route under `cacheComponents: true` + `output: standalone`.

## Run

```bash
npm install
npx playwright install chromium
npm run build && npm start           # port 3000
node scripts/test.mjs                # count _rsc prefetches + measure click -> first paint
node scripts/inspect.mjs             # log per-segment prefetch headers
BASE=http://localhost:3000 node scripts/slowprefetch.mjs   # artificially delay the /c/brands prefetch by 5s, then click
```

## Measurements (next 16.0.3 and 16.3.1-canary.26)

- `scripts/inspect.mjs`: the several `\?_rsc=` requests per route are the Next 16 segment cache,
  one request per segment (`/_tree`, `/_head`, `/_index`, `/c`, `/c/brands`, `/c/brands/__PAGE__`),
  not repeated fetches of the same payload. 16.0.3 = 6 requests, canary = 2 requests.
- `scripts/test.mjs`: click -> destination first paint = ~90ms; full (5s dynamic) content at ~5.4s.
- `scripts/slowprefetch.mjs`: with an in-flight prefetch held for 5s, the click still issues its own
  navigation request (~50ms later) and paints in ~90-150ms. Navigation is not blocked by the prefetch.
