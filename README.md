# Reproduction — vercel/next.js#42082 (duplicated CSS module rules break cascade order)

Mirror/repair of https://github.com/whiteand/next-js-css-order-bug (commit `91bc840`), pinned to
`next@canary` and forced onto the webpack builder, because Next.js 16 builds with Turbopack by
default and Turbopack does **not** show the bug.

## Setup

```bash
npm install
npx playwright install chromium
npm run build     # next build --webpack
npm start         # http://localhost:3000
node check.mjs 3000
```

## Steps (manual)

1. Open `http://localhost:3000/to` → the box is **crimson** ("Red Background").
2. Open `http://localhost:3000/from`, click "Page without link to lazy" → same `/to` page, but the
   box is now **white**.

## Why

`_app.tsx` renders a `next/dynamic` component that links to `/lazy`. On `/from`, `next/link`
prefetches the `/lazy` route, which loads `static/css/<lazy>.css`. That chunk contains a **duplicate
copy** of `Tile.module.scss` (`.Tile_wrapper{background-color:#fff}`) and is appended to `<head>`
*after* the `/to` page CSS, so `.Tile_wrapper` wins over
`.NotLazyTileWrapper_wrapper{background-color:crimson}` purely because of insertion order.

`check.mjs` prints the stylesheet order and exits non-zero when the two backgrounds differ.
