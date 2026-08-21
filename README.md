# Repro: next/og (ImageResponse) renders SVG `<title>` as visible text — vercel/next.js#88097

`<title>` inside an inline `<svg>` is accessibility metadata and must not be painted,
but satori/next-og draws it as visible text in the generated OG image.

## Run

```bash
npm install
npm run dev   # or: npm run build && npm start
```

- `/opengraph-image`  → circle **plus** the text "Accessible logo title" (bug)
- `/notitle/opengraph-image` → control, identical SVG without `<title>`

Pixel diff of the two PNGs: ~820 differing pixels in bbox x=200..346, y=54..70
(the painted title text). Reproduced on next@16.1.1-canary.12 in both `next dev`
and `next start`.
