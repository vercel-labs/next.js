# Repro: cacheComponents + Clerk -> "Uncached data was accessed outside of <Suspense>"

Issue: https://github.com/vercel/next.js/issues/85490
(the reporter's repo https://github.com/techotaku1/gonzaapp returns 404, so this is a minimal rebuild)

## Run

```
npm install
npm run build
```

## Result matrix (observed)

| next | @clerk/nextjs | build |
|---|---|---|
| 16.0.0 | 6.34.0 | FAIL: Route "/sign-in/[[...sign-in]]": Uncached data was accessed outside of <Suspense> |
| 16.0.10 | 7.0.0 | FAIL (same error) |
| 16.0.10 | 7.8.0 | PASS |
| 16.3.1 | 7.8.0 | PASS, /sign-in/[[...sign-in]] is Partial Prerender |

The error stack only points at `body` / `html` (root layout) even with `--debug-prerender`.
The uncached access comes from the server `ClerkProvider` in `app/layout.jsx`, not from the
page, and wrapping the page in `<Suspense>` (as done here) does not help.
