# Repro: next/image `placeholder="blur"` with a URL `blurDataURL` renders nothing (#42140)

Next.js inlines the blur placeholder as a `data:image/svg+xml` background-image whose
inner `<image href="...">` points at the given `blurDataURL`. Browsers block external
resource loading inside data-URL SVGs, so any non-`data:` `blurDataURL`
(`https://…`, `http://…`) produces a fully transparent placeholder and the network
request for that URL is never made. A base64 data URL works.

## Run

```bash
npm install
npm run dev   # or: npm run build && npm start
# open http://localhost:3000
```

`/api/slow` serves `public/photo.png` after an 8s delay so the placeholder is visible.
The first image uses `blurDataURL="http://localhost:3000/blur.png"` (broken, blank),
the second uses the same PNG as a base64 data URL (blurred placeholder shows).

`node check.js` (with the dev server running) prints the number of non-transparent
pixels rendered by each placeholder SVG: `0` for the URL case, `1600` for base64.
