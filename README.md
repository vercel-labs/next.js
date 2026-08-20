# Repro: vercel/next.js#53858 — styles break after client-side navigation (pages router)

Minimal reproduction of https://github.com/vercel/next.js/issues/53858.
The original report only linked a screen recording, so this is a from-scratch minimal repro.

## Root cause shown here

Two CSS chunks contain equal-specificity rules for the same element:

- `styles/base.css.ts` (`base`) — red, 5px padding — imported statically by `pages/b.js`
- `styles/emphasis.css.ts` (`emphasis`) — green, 40px padding — inside a `next/dynamic` component used by `/a` and `/b`

On a **full load** of `/b`, Next emits `base` **before** `emphasis`, so `emphasis` wins (GREEN / 40px).
On a **client-side navigation** `/a` → `/b`, the `emphasis` chunk is already in the document and the
newly needed `base` chunk is appended **after** it, so `base` wins and the element renders RED / 5px.

The bug is not vanilla-extract specific: `/c` → `/d` reproduce the identical flip using plain CSS Modules.

## Run

```bash
npm install
npm run build   # next build --webpack
npm start       # http://localhost:3000
```

Manual: open `/b` (green, 40px). Then open `/a` and click the `/b` link — it becomes red, 5px.
Same for `/c` → `/d` (CSS Modules).

Automated (server must be running on :3000):

```bash
npx playwright install chromium
npm run verify
```

Expected output today:

```
vanilla-extract  /b direct=rgb(0, 128, 0)/40px  /a->/b nav=rgb(255, 0, 0)/5px  => BROKEN
css-modules      /d direct=rgb(0, 128, 0)/40px  /c->/d nav=rgb(255, 0, 0)/5px  => BROKEN
```

## Verified affected

- `next@16.3.1-canary.25`, pages router — webpack production, webpack dev, and Turbopack production
  (Turbopack: run `next build` / `next dev` without `--webpack`; the vanilla-extract plugin is
  webpack-only, so use the `/c` → `/d` CSS-Modules pages there)
- `next@14.2.4` — same failure

The `splitChunks` `css/mini-extract` single-chunk workaround from the issue thread hides it by
removing multiple CSS chunks entirely.
