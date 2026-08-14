# next 16.3.1 `output: 'standalone'` + pnpm: missing `@swc/helpers/esm/*` helper

Reproduction for https://github.com/vercel/next.js/issues/97358 (mirrors
https://github.com/jonggeonlee-twenty/next-standalone-pnpm-repro and adds a Docker-free script).

## Run

```sh
./repro.sh          # pnpm + Node >= 22.10, no Docker needed
# or
docker build -t next-standalone-pnpm-repro . && docker run --rm next-standalone-pnpm-repro
```

## Observed (next@16.3.1)

```
Error: Cannot find module '.../node_modules/.pnpm/next@16.3.1_.../node_modules/@swc/helpers/esm/_interop_require_default.js'
  code: 'MODULE_NOT_FOUND'
```

The server exits before listening. `.next/standalone` contains only
`@swc/helpers/cjs/_interop_require_default.cjs`.

## Root cause evidence

- next@16.3.0 depends on `@swc/helpers@0.5.15`; next@16.3.1 bumped it to `@swc/helpers@0.5.23`.
- 0.5.23 added a `"module-sync"` condition to every subpath export
  (`"./_/_interop_require_default": { "module-sync": "./esm/_interop_require_default.js", ..., "default": "./cjs/_interop_require_default.cjs" }`).
- Node >= 22.10 applies `module-sync` for `require()`, so the standalone server resolves the
  **ESM** file, while output file tracing copied only the **CJS** file.
- Manually copying `@swc/helpers/esm` into the standalone output makes the server boot (HTTP 200).
- Switching `next` to `16.3.0` (i.e. `@swc/helpers@0.5.15`, which has no `module-sync` condition)
  also boots successfully.
