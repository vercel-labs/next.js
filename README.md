# Reproduction for vercel/next.js#58440

`Attempted import error: 'observer' is not exported from '@legendapp/state/react'`

The reporter's linked repo (github.com/Tekutorukushi/nextjs) returns 404, so this is a minimal rebuild:
a client component (`components/Custom/index.jsx`) importing `observer` from the dual CJS/ESM
package `@legendapp/state/react`, rendered from an App Router page.

## Run

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Result matrix (verified in a Linux sandbox, Node 24)

| next | outcome |
| --- | --- |
| 14.0.1 | 200, renders "custom components" |
| **14.0.2** | **500 — `Attempted import error: 'observer' is not exported` + `TypeError: (0, ..._react__WEBPACK_IMPORTED_MODULE_1__.observer) is not a function`** |
| **14.0.3** | **same 500** |
| 14.0.4 | 200 |
| 14.1.0 / 14.2.33 / 15.5.7 | 200 |
| 16.3.1-canary.10 (Turbopack and `--webpack`) | 200, `next build --webpack` also succeeds |

To reproduce the failure keep `next@14.0.2` (or `14.0.3`); newer versions no longer fail.
Regression window matches https://github.com/vercel/next.js/pull/57784 (shipped in 14.0.2).
