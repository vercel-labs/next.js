# Repro: next/babel + core-js `useBuiltIns: "usage"` -> `TypeError: $ is not a function` (App Router)

Issue: https://github.com/vercel/next.js/issues/74743

## Run
```
npm install
npx next dev --webpack   # Next 16: webpack required, Turbopack ignores .babelrc
# Next 15: npm run dev
```
Open http://localhost:3001 (or the printed port) and check the browser console.

## Observed
```
TypeError: $ is not a function
  at ./node_modules/core-js/modules/es.global-this.js:8
  at ./node_modules/core-js/modules/esnext.global-this.js:4
```
Babel's `preset-env` `useBuiltIns: "usage"` polyfill injection is applied to core-js'
own internal modules (self-polyfilling), which breaks them. Only happens in the
App Router browser bundle. Verified on next@15.1.4 and next@16.3.1 (--webpack).

Workaround: exclude `/core-js/` from webpack module rules in next.config.js.
