# Reproduction: prefetch request count doubles after upgrading Next.js 15 -> 16 (#85470)

The reporter's linked repo (`carlos-dubon/next-16`) is a 404, so this is a minimal
stand-in: one page with 20 `<Link>`s to a dynamic route (`/products/[slug]`) that has a
shared `products/layout.tsx` and a `loading.tsx`. The only difference between the three
apps is the `next` version.

## Run

```bash
npm install
for d in apps/next15 apps/next16 apps/next163; do (cd $d && npm install && npx next build); done
(cd apps/next15  && npx next start -p 3015 &)
(cd apps/next16  && npx next start -p 3016 &)
(cd apps/next163 && npx next start -p 3163 &)
node measure.mjs   # loads "/" in Chromium, counts RSC prefetch requests per version
```

`measure.mjs` writes per-version request dumps and screenshots; adjust the output dir at
the top if needed.

## Result (production builds, `next start`, 20 links in viewport)

| next | RSC prefetch requests | breakdown |
| --- | --- | --- |
| 15.5.5 | 20 | 20 full-route prefetches |
| 16.0.0 | **40** | 20 `Next-Router-Segment-Prefetch: /_tree` + 20 segment fetches |
| 16.3.1 | 24 | 4 `/_tree` (inlined/bundled) + 20 segment fetches |

Next 16.0.0 issues exactly 2x the requests of 15.5.5 for the same page. 16.3.1
(`experimental.prefetchInlining` on by default since 16.2) cuts the tree requests from 20
to 4 but still makes 20% more requests than 15.
