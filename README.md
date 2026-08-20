# Repro: next#69574 — pages `_error.tsx` renders instead of app `global-error.tsx` for a `force-static` app route

Based on the reporter's repro (holubiev/nextjs-global-error-reproduction-app), updated to next@16.3.1-canary.24.

## Run

```bash
pnpm install
pnpm build   # next build --webpack
pnpm start
curl -i http://localhost:3000/example/en
```

## Observed (16.3.1-canary.24)

- 500 response whose HTML is the **Pages Router** `pages/_error.tsx` output (`But this works!`, `"page":"/_error"` in `__NEXT_DATA__`), and `Error.getInitialProps` runs on the server (`Can handle server redirects here.` logged).
- App Router `app/global-error.tsx` is never used.
- Deleting `pages/_error.tsx`: response is plain-text `Internal Server Error` (still not `global-error.tsx`).
- Changing the page to `export const dynamic = 'force-dynamic'`: response is the App Router error shell (`<html id="__next_error__">`) and `global-error.tsx` renders. So the crossover is specific to `force-static`.
- Bonus: with the default Turbopack builder (`next build`), the build itself crashes with
  `unhandledRejection Error [PageNotFoundError]: Cannot find module for page: /_document`
  during "Collecting page data" — only when `pages/_error.tsx` exists. Hence `--webpack` in the scripts above.
