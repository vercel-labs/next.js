# Repro: `.catch()` on a dynamic call makes `next build` prerender the page statically

Issue: https://github.com/vercel/next.js/issues/69025

`app/action.ts` reads `cookies()`. During `next build`, `cookies()` throws a
`DynamicServerError` to bail out of static generation. In `app/page.tsx` that
promise is chained with `.catch(() => null)`, which swallows the bail-out error,
so the page keeps prerendering statically and the user code runs with a `null`
result and fails a runtime assertion.

## Repro case
```
npm install
npm run build
```
=> build fails: `AssertionError [ERR_ASSERTION]: triggerRepro never returns null`
   / `Error occurred prerendering page "/"`.

## Control case
Remove `.catch(() => null)` in `app/page.tsx`, then `npm run build`
=> build succeeds and `/` is reported as dynamic (`ƒ`).

Confirmed on next@16.3.1 (Turbopack build) and next@14.2.5.
