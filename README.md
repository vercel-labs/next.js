# Repro: issue #60004 — "next/image decreases (lighthouse) performance"

Minimal App Router app that renders the *same* asset twice, once with `next/image`
and once with a plain `<img>`, and scripts a Lighthouse (mobile, simulated
throttling) A/B comparison against a production build.

Routes:
- `/next-image`      — `next/image`, 1200x800 PNG (636 KB source), `priority`
- `/plain-img`       — plain `<img>`, same PNG
- `/next-image-svg`  — 12x `next/image` with an SVG logo (starter-like)
- `/plain-img-svg`   — 12x plain `<img>` with the same SVG

## Run

```bash
npm install
npm run build
npm start &                        # production server on :3000
CHROME_PATH=/path/to/chrome npm run lighthouse           # PNG pages
CHROME_PATH=/path/to/chrome ROUTES=/next-image-svg,/plain-img-svg npm run lighthouse
```

`lighthouse-compare.mjs` runs 3 Lighthouse passes per route and prints the median
score / FCP / LCP / TBT / Speed Index plus the detected LCP element.

## Result on next@16.3.1-canary.25 (median of 3, mobile preset)

| route | score | FCP | LCP | TBT |
|---|---|---|---|---|
| /next-image | 92 | 681 ms | 3344 ms | 83 ms |
| /plain-img | 83 | 642 ms | 4675 ms | 79 ms |
| /next-image-svg | 100 | 652 ms | 1075 ms | 71 ms |
| /plain-img-svg | 100 | 641 ms | 1423 ms | 73 ms |

`next/image` is equal or better in every case here (the optimizer serves a much
smaller AVIF/WebP than the raw PNG). The only measurable cost is client JS:
gzipped script bytes per page 179,506 (`next/image`) vs 173,771 (plain `<img>`),
i.e. ~5.7 KB, which produced no TBT regression beyond run-to-run noise.
