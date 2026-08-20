# Repro: next/image `sizes` ignored with `calc()` + over-sized downloads without `sizes` (#44244)

Next.js `16.3.1-canary.25` (same output on `13.0.8-canary.2`), local image `images/photo.jpeg` (1920x1280).

```bash
npm install
npx playwright install chromium
npm run dev &           # serves on http://localhost:3002
npm test
```

`pages/index.js` renders 4 cases, each visually 300px wide, on a 375px viewport:

| case | props | srcSet built by next/image | requested width (DPR1 / DPR2) |
| --- | --- | --- | --- |
| 1 | `fill sizes="calc(33vw - 6rem)"` | **all 15 widths** 32w..3840w (sizes ignored) | 32 / 64 |
| 2 | `fill sizes="33vw"` (control) | 256w..3840w (narrowed) | 256 / 256 |
| 3 | `width={800} height={533}`, CSS width 100% | `828 1x, 1920 2x` | 828 / **1920** |
| 4 | static import, no width/height/sizes, CSS width 100% | `1920 1x, 3840 2x` | 1920 / **3840** |

Case 1 vs 2: any `sizes` value where the `vw` token is not preceded by whitespace/start
(e.g. inside `calc(...)`) does not narrow `srcSet` at all - `getWidths()` falls back to every
configured device/image size, so `srcSet` is identical no matter what `sizes` says.

Cases 3 & 4: without `sizes`, `srcSet` only contains 1x/2x of the intrinsic width, so an image
displayed at 300px downloads the 3840px variant on a DPR2 phone (12.8x the rendered size), and
`src` is the largest variant.
