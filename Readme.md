# Minimal repro: CSS module order differs between `next dev` and `next build` (App Router)

Ref: https://github.com/vercel/next.js/issues/64921 — reproduced on `next@16.3.1`.

Two CSS modules define the same class (`.box`) with a conflicting `background-color`, so
per-route import order decides the winner:

- `app/a/page.tsx` imports `red.module.css` then `green.module.css` -> expected **green**
- `app/b/page.tsx` imports `green.module.css` then `red.module.css` -> expected **red**

## Steps

```sh
npm install
npm run dev     # http://localhost:3000/a -> green, /b -> red   (correct, per-route order)
npm run build   # Turbopack build (default in Next 16)
npm run start   # http://localhost:3001/a -> RED (wrong), /b -> red
```

Automated check (dev on :3000, start on :3001):

```sh
npx playwright install chromium
node check.mjs
```

## Observed (next@16.3.1)

```
dev  /a #box background = rgb(0, 128, 0)   <- expected
dev  /b #box background = rgb(255, 0, 0)   <- expected
prod /a #box background = rgb(255, 0, 0)   <- WRONG, differs from dev
prod /b #box background = rgb(255, 0, 0)
```

Production builds merge both modules into one shared stylesheet chunk with a single global
order, so at least one route always gets the wrong order:

- Turbopack build: one chunk `green` then `red` -> `/a` broken
- `next build --webpack`: one chunk `red` then `green` -> `/b` broken
- `next build --webpack` + `experimental.cssChunking: "strict"`: two chunks, matches dev (no route broken)
- `experimental.cssChunking: "strict" | false` is rejected by the Turbopack build
  ("only supported with webpack"), so there is no workaround for the default Next 16 build.
