# Repro: next/image width/height docs ambiguity (vercel/next.js#75114)

Docs say `width`/`height` are the *intrinsic* image size used only for aspect ratio,
and that rendered size is controlled by CSS. In practice `width`/`height` drive the
generated `srcset` widths, so following the docs literally ships a huge image into a
tiny box.

## Run

```bash
npm install
npm run dev
# then
curl -s localhost:3000 | grep -o '<img[^>]*>'
```

## Observed (Next.js 16.3.1)

- A) `width={5000} height={5000}` (true intrinsic size) in a 100x100 CSS box
  -> `srcset="/_next/image?url=%2Fbig.jpg&w=3840&q=75 1x"` (3840x3840 JPEG, ~43 KB)
- B) `width={100} height={100}` in the same box
  -> `srcset=".. w=128 1x, .. w=256 2x"` (373 B / 519 B)
- C) static import (5000x5000) behaves like A

`sizes`/`fill` are the documented escape hatch, but the width/height prose does not
say that width/height select the optimized widths.
