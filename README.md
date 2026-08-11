# Reproduction for vercel/next.js#85271 — cacheComponents JSDoc

`check-jsdoc.mjs` uses the TypeScript language service to print the editor hover
documentation for `cacheComponents` in a `next.config.ts`, for several versions of `next`.

Run:

```bash
npm run repro
```

Result: the misleading "Next.js will automatically cache page-level components and functions"
text is present up to and including `next@16.2.12`, and is gone in `next@16.3.0` and canary
(fixed by https://github.com/vercel/next.js/pull/94474).
