# Repro: `with-electron-typescript` example fails to start with yarn/pnpm (next.js#75913)

`npm run dev` (`tsc -p electron-src && electron .`) crashes on load with `ERR_REQUIRE_ESM`
when dependencies are installed with **yarn 1** or **pnpm**.

## Cause

The example pins `electron-is-dev@^1.2.0`, but `electron-next@3.1.5` declares
`electron-is-dev: ">=0.3.0"`. npm dedupes that to the hoisted 1.2.0 (CJS), while yarn 1
and pnpm resolve the range to `electron-is-dev@3.0.1`, which is `"type": "module"`, and
install it nested at `node_modules/electron-next/node_modules/electron-is-dev`.
`electron-next/index.js` is CommonJS and `require()`s it -> Electron's Node throws
`ERR_REQUIRE_ESM`.

## Steps

```bash
yarn install            # or: pnpm install
yarn run build-electron
yarn run dev            # electron . -> App threw an error during load
```

(headless CI: `xvfb-run -a ./node_modules/.bin/electron . --no-sandbox`)

## Observed

See `electron-dev-error.log`:

```
App threw an error during load
Error [ERR_REQUIRE_ESM]: require() of ES Module .../node_modules/electron-next/node_modules/electron-is-dev/index.js
from .../node_modules/electron-next/index.js not supported.
```

`npm install` in the same tree does **not** fail (single hoisted electron-is-dev@1.2.0).

## Workaround

Force the CJS version, e.g. yarn `resolutions` / pnpm `overrides`:
`"electron-is-dev": "1.2.0"`.
