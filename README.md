# Repro: blur placeholder of `next/image` stays visible after the image is loaded (vercel/next.js#53329)

`next/image` removes the `placeholder="blur"` background only from **client-side React state**
(`setBlurComplete(true)` inside `handleLoading` in `next/dist/client/image-component.js`, gated on
hydration + `img.decode()`). The `background-image` blur SVG is therefore still painted after the
`<img>` itself is fully loaded and painted — which is clearly visible through the transparent pixels
of a PNG with an alpha channel.

## Run

```bash
npm install
npx playwright install chromium

# dev
npm run dev
npm run test:dev            # baseline
npm run test:dev:throttled  # client JS arrives 1.5s after the image

# production
npm run build && npm start
npm run test:prod
npm run test:prod:throttled
```

`test/blur.mjs` samples the `<img>` every animation frame and prints when the image became
`complete` vs. when the inline `background-image` blur placeholder disappeared, and writes
`<label>-at-image-loaded.png` / `<label>-after.png` screenshots to `artifacts/`.

The page renders a 1200x1200 PNG (colored circle, fully transparent outside it) on a `limegreen`
body, so any leftover blur is visible as a non-green haze around the circle.

## Observed with next@16.3.1-canary.25 (Chromium 151 headless)

| scenario | image loaded | blur removed | blur visible after load | frames painted with both |
| --- | --- | --- | --- | --- |
| `next dev` | 763 ms | 763 ms | 0 ms | 0 |
| `next dev`, JS +1.5s | 95 ms | 2306 ms | **2211 ms** | 41 |
| `next start` | 448 ms | 851 ms | **403 ms** | 2 |
| `next start`, JS +1.5s | 382 ms | 1659 ms | **1277 ms** | 57 |

Screenshot pixel sampling inside a transparent region of the loaded image
(`prod-throttled-at-image-loaded.png` vs `prod-throttled-after.png`):

```
(30, 300)  rgb(40,163,95)   ->  rgb(50,205,50)   (limegreen body)
(400, 150) rgb(72,105,134)  ->  rgb(50,205,50)
```

i.e. the blur placeholder is still being composited on top of the background while the loaded
image is already on screen. It is not dev-only: `next start` shows the same gap, and the gap scales
with how long client JS takes to arrive.
