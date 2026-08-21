# Repro: vercel/next.js#82650

`next/dynamic` import of a Server Component that contains an inline `"use cache"`
function fails in **Turbopack** dev/build with:

```
It is not allowed to define inline "use cache" annotated functions in Client Components.
```

Webpack dev/build compile and render the same code fine.

```bash
npm install

npm run dev          # next dev --turbopack -> 500, error above
npm run dev:webpack  # next dev (webpack)   -> 200, renders "Hello there"
npm run build        # webpack build        -> OK
```
