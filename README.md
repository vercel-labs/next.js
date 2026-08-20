# Repro: issue #65335 — identical RSC payloads get different `_rsc` cache keys

The `_rsc` cache-busting query param is derived from the *originating* page, not from
the requested URL, so the same target URL returns byte-identical RSC payloads under a
different cache key per referring route. A CDN therefore misses on every variation.

## Run

```bash
npm install
npx playwright install chromium
npm run build
npm start &            # next start on :3000
npm run repro          # Playwright: collects _rsc params + compares bodies
```

## Observed (next@16.3.1-canary.25)

```
segment: /_tree
  linked from /category/1  -> /product/1?_rsc=3zF3tuUJ9K_92Fye  bytes=234
  linked from /category/2  -> /product/1?_rsc=sDn38yKnY1gM01TT  bytes=234
  linked from /            -> /product/1?_rsc=5CB68i4pnAekjehf  bytes=234
  distinct _rsc values: 3, distinct bodies: 1

segment: /product/$d$id/__PAGE__
  linked from /category/1  -> /product/1?_rsc=HuZA5VyDNhLEHboY  bytes=3394
  linked from /category/2  -> /product/1?_rsc=xGvS7L2fbZV0Whj9  bytes=3394
  linked from /            -> /product/1?_rsc=CpBeDDNVZQY7wUyu  bytes=3394
  distinct _rsc values: 3, distinct bodies: 1

Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding
```

The param is stable across reloads of the same page and is shared by all links on that
page (`/product/1` and `/product/2` get the same `_rsc`), which confirms it is a hash of
the originating route/state rather than of the response.
