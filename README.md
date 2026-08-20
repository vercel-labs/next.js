# Repro: exported `MiddlewareConfig` type is incomplete (vercel/next.js#68384)

`next/server` exports `MiddlewareConfig` (= internal `MiddlewareConfigInput`),
which only allows `matcher`, `regions` and `unstable_allowDynamic`.
It does **not** allow `runtime`, even though Next.js accepts and honours
`export const config = { runtime: 'nodejs' }` in `middleware.ts`.

```
npm install
npx tsc --noEmit   # TS2353: 'runtime' does not exist in type 'MiddlewareConfigInput'
npx next dev       # middleware compiles and runs fine with the same object
npx next build     # fails only because of the bogus type error above
```

Original 14.2.5 part of the report (`matcher` typed with `regexp` /
`originalSource` instead of `source`) is already fixed: `next/server` now
exports the input type using `source`. The remaining gap is `runtime`
(reported in a follow-up comment), still missing on 15.5.4 and 16 canary.
