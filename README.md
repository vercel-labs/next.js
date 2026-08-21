# Repro: vercel/next.js#78118

`next/font/google` requests Google Fonts with a hardcoded macOS user agent
(`packages/font/src/google/fetch-resource.ts`). Google serves *unhinted* woff2
files to that UA, so TrueType fonts loaded through `next/font/google` lose all
TTF hinting (`fpgm`, `prep`, `cvt ` tables and per-glyph instructions). On
Windows / non-retina rendering this visibly misaligns glyph baselines and stems.

## Headless check (no browser needed)

```bash
pip install fonttools brotli
python3 scripts/compare-hinting.py
```

Expected output: the macOS UA (the one Next uses) returns a woff2 with
`fpgm=NO prep=NO cvt =NO` and 0 hinting instruction bytes, while the Windows UA
returns the same subset with all hinting tables and ~6100 instruction bytes.

## Visual check

```bash
npm install
npm run dev   # or: npm run build && npm start
```

Open http://localhost:3000: each size renders the `next/font/google`
(unhinted) text above the identical Google woff2 fetched with a Windows UA
(hinted, checked into `public/fonts/`). The difference is clearest on Windows,
especially at 200% OS scaling.
