# Repro: next@16.3.1 `output: 'standalone'` crashes at boot — missing `@swc/helpers` esm files (Node >= 22.12)

Upstream issue: https://github.com/vercel/next.js/issues/97599

## Run

```bash
pnpm install
pnpm build
node .next/standalone/server.js
```

## Observed (next@16.3.1, Node 24.17.0)

```
Error: Cannot find module '.../.next/standalone/node_modules/.pnpm/next@16.3.1_.../node_modules/@swc/helpers/esm/_interop_require_default.js'
    at createEsmNotFoundErr (node:internal/modules/cjs/loader:1537:15)
    at resolveExports (node:internal/modules/cjs/loader:707:14)
    at .../next/dist/server/require-hook.js:68:36
  code: 'MODULE_NOT_FOUND'
```

The traced copy only contains the CJS files:

```
$ ls .next/standalone/node_modules/.pnpm/@swc+helpers@0.5.23/node_modules/@swc/helpers/
cjs  package.json
```

## Cause

`next@16.3.1` bumped `@swc/helpers` 0.5.15 -> 0.5.23, which added a `module-sync`
export condition pointing at `./esm/*`. Output file tracing resolves the `default`
(cjs) condition, but Node >= 22.12 `require()` prefers `module-sync`, so the runtime
asks for `esm/` files that were never copied.

## Controls

* `next@16.3.0` (`@swc/helpers@0.5.15`, no `module-sync`): boots, `GET /` -> 200.
* `next@16.3.1-canary.24`: traces `esm/` too, boots, `GET /` -> 200.
