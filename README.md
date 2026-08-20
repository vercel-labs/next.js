# Repro: vercel/next.js#73426 — `Link prefetch` never prefetches the route the user initially landed on

Next.js `15.4.6`, App Router, dynamic route `/product/[id]` (dynamically rendered).

## Run

```bash
npm install
npx playwright install chromium
npm run build && npm start          # http://localhost:3000
# in another shell:
npm run verify                      # scripted Playwright check
```

Manual steps: open `/product/3` directly (hard load), click "Home", wait, then click "Product 3".

## Observed (15.4.6)

After landing on `/product/3`, the layout's `<Link prefetch>` list issues RSC prefetches for
`/`, `/product/1`, `/product/2` — but **never for `/product/3`**, because the initially-landed
route is treated as already cached. Navigating back to it does a full, uncached server render.

```
prefetch requests after initial load:
  /?_rsc=...  /product/1?_rsc=...  /product/2?_rsc=...      <- no /product/3
click Product 1 (never landed):   47ms
click Product 3 (initially landed): 2044ms
```

## Notes

* Not reproducible on `next@16.3.1-canary.25` (segment cache on by default): both 42–44ms.
* With `experimental.clientSegmentCache: true` on 15.4.6 there is no per-route difference
  (dynamic routes are simply never prefetched: 2058ms vs 2067ms).
