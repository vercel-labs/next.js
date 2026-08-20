# Minimal repro: inconsistent CSS module order between `next dev` and `next build` (App Router)

Ref: https://github.com/vercel/next.js/issues/64921

Two CSS modules define the same class (`.box`) with conflicting `background-color`.
Each page imports them in its own, page-local order, so per-page order decides the winner:

- `app/a/page.tsx`: `red.module.css` then `green.module.css` -> expected **green**
- `app/b/page.tsx`: `green.module.css` then `red.module.css` -> expected **red**

## Steps

```sh
npm install
npm run dev          # http://localhost:3000/a  -> green, /b -> red   (correct)
npm run build        # Turbopack build (default in Next 16)
npm run start        # http://localhost:3001/a  -> RED (wrong), /b -> red
```

Automated check (needs `npx playwright install chromium`), with dev on :3000 and start on :3001:

```sh
node check.mjs
```

Observed (next@16.3.1):

```
dev  /a #box background = rgb(0, 128, 0)   <- expected
dev  /b #box background = rgb(255, 0, 0)
prod /a #box background = rgb(255, 0, 0)   <- WRONG, differs from dev
prod /b #box background = rgb(255, 0, 0)
```

The Turbopack production build merges both modules into one stylesheet chunk
(`green` then `red`) which is reused by both routes, so `/a` gets the wrong order.
`next build --webpack` emits two chunks with per-page order and matches dev.
