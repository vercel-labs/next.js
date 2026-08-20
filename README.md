# Reproduction harness for vercel/next.js#48120 — global CSS import order in App Router

`app/layout.js` imports global CSS in this order:

```js
import "fake-icons/styles.css";   // node_modules, .svg-inline--fa { width: 200px }
import "../styles/globals.css";   // local,        .svg-inline--fa { width: 20px }, .box { red }
import "../styles/local2.css";    // local,        .box { green }
import "fake-icons2/other.css";   // node_modules, .box { blue }
```

Correct result: `#icon` computed width `20px`, `#box` color `rgb(0, 0, 255)` (last import wins).
Bug: node_modules CSS is emitted *after* local CSS, so `#icon` is `200px`.

## Run

```bash
pnpm install
pnpm build && pnpm start &      # or: pnpm dev
node verify-css-order.mjs http://localhost:3000 run
```

`verify-css-order.mjs` prints computed styles for `/`, `/other` and after a client-side
navigation, and writes screenshots to `screenshots/`.

## Results observed (2026-xx, Linux, pnpm)

| next | `#icon` on `/` (prod) | verdict |
| --- | --- | --- |
| 13.3.1 (version in the issue) | 200px | reproduces (dev also 200px) |
| 13.5.2 | 200px | reproduces |
| 14.2.33 | 20px | fixed |
| 15.5.6 | 20px | fixed |
| 16.3.1-canary.24 (webpack and Turbopack, dev and prod) | 20px | fixed |

To test an old version, swap `next`/`react`/`react-dom` (e.g. `next@13.3.1`,
`react@18.2.0`) and add `experimental: { appDir: true }` to `next.config.js` for 13.3.x.
