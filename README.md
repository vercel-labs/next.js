# next/image `placeholder="blur"` causes multi-hundred-ms paint stalls (Firefox)

Reproduction for https://github.com/vercel/next.js/issues/86264 (mirror of
https://github.com/RJWadley/next-image-slow plus an automated, headless measurement).

`next/image` with `placeholder="blur"` paints an inline SVG data URL that blurs a tiny
JPEG with `feGaussianBlur stdDeviation='20'` **twice**, plus `feColorMatrix`/`feFlood`/
two `feComposite` passes. Rasterizing that filter chain at the element's on-screen size
blocks painting for hundreds of milliseconds.

## Run

```bash
pnpm install            # or npm install
npx playwright install firefox chromium
pnpm build && pnpm start &   # serves the built app on :3000
pnpm measure            # Playwright: measures frame stalls in Firefox + Chromium
```

`measure.mjs` prints, per browser:

* `app` – frame times while the built page (`app/page.tsx`, `placeholder="blur"`, image
  request held open so the placeholder stays visible) first paints the placeholder.
* `bench` – `public/blur-stall.html`, which paints a 1200x600 element three ways:
  `next` (the exact SVG `next/image` emits), `cssblur` (same JPEG + `filter: blur(20px)`),
  `none` (same JPEG, unblurred). Each variant is cache-busted.

## Observed (headless, software rasterization, 1200x600 element)

| case | Firefox frames > 100 ms | Chromium frames > 100 ms |
| --- | --- | --- |
| built app, 1264x1264 `placeholder="blur"` | **900 ms** (+200 ms) | 517/500/483... ms |
| bench `next` (1200x600 blur SVG) | 201 / 200 / 167 ms | 317 / 300 ms |
| bench `cssblur` | none (60 fps) | none (60 fps) |
| bench `none` | none (60 fps) | none (60 fps) |

The 900 ms Firefox frame matches the ~1200 ms paint the issue reports on an M1 Max.

Cost scales with the painted area in Firefox: 300x150 → no stall, 1200x600 → ~550 ms
total, 2400x1200 → ~2.4 s total (three frames of 833/851/716 ms). `measure-variants.mjs`
runs the size sweep. On real hardware Chrome rasterizes this on the GPU while Firefox
does not, which is why users see it as a Firefox-only 1+ second paint.
