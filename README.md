# Repro: `export const dynamic = 'auto'` opts a route into dynamic rendering

Issue: https://github.com/vercel/next.js/issues/65799

## Run

```bash
npm install
npm run build
```

## Expected

`'auto'` is documented as the default, so `/auto` and `/none` should both be
prerendered as static (`○`).

## Actual

```
├ ƒ /auto
└ ○ /none
```

`/auto` is `ƒ (Dynamic) server-rendered on demand`; under `next start` it responds
with `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`,
while `/none` is a static `x-nextjs-cache: HIT`.

Reproduced on next@14.2.3 and next@16.3.1-canary.25.

## Cause

`create-component-tree` sets `workStore.forceStatic = dynamic === 'force-static'`
for any string `dynamic`, so `'auto'` sets it to `false` (instead of leaving it
`undefined`). `app-render` then runs
`if (workStore.forceStatic === false) { ... revalidate = 0 }`, which marks the
route dynamic.