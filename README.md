# Repro: Next.js pages router externalizes antd's ESM-only `rc-util/es/*` files as CJS `require()`

Upstream issue: https://github.com/vercel/next.js/issues/75783

## Steps

```bash
npm install   # or yarn; do NOT use pnpm (its non-hoisted layout hides the bug)
npm run build
```

## Result

```
   Collecting page data ...
unhandledRejection [Error: Cannot find module '<cwd>/node_modules/rc-util/es/utils/get' imported from <cwd>/node_modules/rc-util/es/utils/set.js] {
  type: 'Error',
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file://<cwd>/node_modules/rc-util/es/utils/get'
}
```

`next build` succeeds when `transpilePackages: ['rc-util']` is added, or when installing with pnpm.

## Cause (observed)

`.next/server/pages/_app.js` contains `require("rc-util/es/utils/set")`: Next resolves the package's
`module`/ESM entry (`rc-util` has no `exports` map, `main: ./lib/index`, `module: ./es/index`) but emits a
CommonJS `require()` external. On Node versions with `require(esm)`/module-syntax detection the `es/*.js`
files are then evaluated as ESM, where the extensionless `import get from "./get"` is not resolvable.
