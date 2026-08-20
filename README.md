# Repro: next.js#45473 — webpack production build ships ES2020+ syntax from node_modules

Minimal reproduction of https://github.com/vercel/next.js/issues/45473 on `next@16.3.1-canary.25`.

`filter-obj@5.1.0` (untranspiled npm package) uses optional chaining (`?.`, ES2020, unsupported by Safari 12).
`browserslist: ["safari 12"]` is set explicitly in package.json, so the syntax must be downleveled.

## Run

```bash
npm install
npm run build   # next build --webpack
npm run check   # scans .next/static/chunks for ?. / ??
```

## Result

`npm run check` fails: `.next/static/chunks/pages/index-*.js` still contains
`r?.enumerable&&Object.defineProperty(...)` — the raw optional chaining from `filter-obj`.
`npm run check:es` (es-check es2019) fails on the same file with `SyntaxError: Unexpected token`.

`npm run build:turbopack` (Turbopack, default in Next 16) *does* downlevel it to
`(null==t?void 0:t.enumerable)` — only the webpack pipeline is affected.

Adding `transpilePackages: ['filter-obj']` to next.config.js is the current workaround.
