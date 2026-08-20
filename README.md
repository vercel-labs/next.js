# next/font called from a pre-compiled workspace package -> "(0 , x.default) is not a function"

Minimal reproduction of https://github.com/vercel/next.js/issues/70580

`packages/ui-fonts/dist/fonts.js` is a **pre-compiled CJS file** (exactly what `tsc`
emits for `packages/ui-fonts/src-fonts.ts`) that calls `next/font/local` and
`next/font/google`. The app imports the exported font from it.

Because the next-font transform never runs on the already-compiled package file,
`next/font/local` / `next/font/google` are resolved as plain modules and the call
throws at build time (collect page data).

## Run

```
npm install
npm run build --workspace app
```

## Observed (Next.js 16.3.1)

```
Error: Failed to collect configuration for /_not-found
  [cause]: TypeError: (0 , d.default) is not a function
      at module evaluation (../packages/ui-fonts/dist/fonts.js:8:36)
```

Commenting out the `next/font/local` line leaves the google variant, which fails the same way:

```
TypeError: (0 , a.r(...).Oxanium) is not a function
    at module evaluation (../packages/ui-fonts/dist/fonts.js:9:32)
```

## Expected

Either the font call works from a transpiled package, or next/font throws a clear
actionable error explaining it must be called from a file compiled by Next.js.
