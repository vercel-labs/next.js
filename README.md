# Repro: FULL prefetch is refetched when a navigation starts while it is in flight

Mirrors https://github.com/hamidrezahanafi/prefetch-full for
https://github.com/vercel/next.js/issues/86400, plus a deterministic Playwright harness.

- `app/Link.tsx` calls `router.prefetch(href, { kind: PrefetchKind.FULL })` 2s after `mouseenter`.
- `app/search/page.tsx` is `force-dynamic` and takes 5s to render; it logs every server render.

## Steps

```bash
npm install
npx playwright install chromium
npm run build
npm start                 # terminal 1
npm run repro             # terminal 2 (adds 300ms simulated RTT, clicks 200ms after prefetch starts)
```

## Result (next@16.0.3 and next@16.3.1-canary.26)

Three RSC requests for one navigation, and `[server] rendering /search` is logged twice:

```
REQ +2071ms /search?_rsc=...  prefetch=1 segment=/_tree   <- FULL prefetch (tree)
CLICK +2269ms
REQ +2291ms /search?_rsc=...  prefetch=- segment=-        <- navigation refetch (unexpected)
REQ +2393ms /search?_rsc=...  prefetch=- segment=-        <- FULL prefetch data
```

Clicking >=~1 RTT after the prefetch started (e.g. `npm run repro 300 400`) yields only the
2 expected prefetch requests, so the duplicate happens only while the FULL prefetch's
`/_tree` request has not resolved yet.
