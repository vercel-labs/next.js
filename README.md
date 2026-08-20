# Repro: vercel/next.js#37327 — CSS `@import url(https://...)` fails with `experimental.urlImports`

## Run

```bash
npm install
npm run dev   # next dev --webpack
# open http://localhost:3000
```

## Expected
Page compiles; bootstrap CSS is loaded from the CDN.

## Actual (webpack, Next 16.3.1-canary.25)
```
⨯ ./styles/globals.css
Module not found: Can't resolve 'https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css'
```
HTTP 500 on `/`.

Removing `experimental.urlImports` from `next.config.js` makes it compile (HTTP 200).

With Turbopack (`npm run dev:turbopack`) `experimental.urlImports` is ignored entirely
(warning printed) and the `@import` is left in the emitted CSS, so the browser fetches it.
