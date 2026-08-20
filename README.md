# Repro attempt for vercel/next.js#55864 — `loading.tsx` on direct URL access

Minimal port of https://github.com/joulev/debug/tree/nextjs-some-more-bugs
(original repro depended on the now-dead api.punkapi.com; the 5s delay is kept locally).

## Run

```
pnpm install
pnpm build
pnpm start
```

Then open `/beers` directly in a new tab (step 6 of the issue) and compare with
navigating from `/` via `next/link`.

## Result (Next 16.3.1-canary.24 and Next 13.5.3-canary.3, prod build)

`loading.tsx` IS shown on direct URL access: the first streamed HTML chunk already
contains `<div>Loading</div>` inside `<!--$?-->…<template id="B:0">`, and Chromium
reports first-contentful-paint at ~40-80ms locally (~420ms on Vercel), with the
page body remaining "Loading" until the 5s delay resolves.
