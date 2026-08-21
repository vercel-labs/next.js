# next#75960 — race in `makeExternalHandler` / `resolvedExternalPackageDirs`

In `packages/next/src/build/handle-externals.ts`, `resolvedExternalPackageDirs` is
assigned a new `Map()` **before** the `await`s that populate it. A second,
concurrent `handleExternals()` call sees the non-null but still-empty map, skips
initialization, and passes the empty map to `resolveBundlingOptOutPackages()`.
`isResourceInPackages()` then falls back to a `node_modules/<pkg>/` string match,
which fails for store/symlink layouts, so a `transpilePackages` package is
**externalized** instead of bundled — nondeterministically.

## Run

```bash
npm install
npm run repro          # node setup-fixture.mjs && node repro.mjs
```

`repro.mjs` drives the real shipped `makeExternalHandler` from
`next/dist/build/handle-externals.js`.

## Observed (next@15.1.6 and next@16.3.1-canary.26)

```
[sequential]
  call #1: undefined  => BUNDLED/transpiled (correct)
  call #2: undefined  => BUNDLED/transpiled (correct)

[concurrent]
  call #1: undefined  => BUNDLED/transpiled (correct)
  call #2: commonjs mylib  => EXTERNALIZED (wrong)

RACE REPRODUCED: same input, different externals decision.
```

Expected: both concurrent calls return `undefined` (bundle the transpiled package).
Exit code is 1 when the race reproduces.

To check another version: `npm i next@canary && npm run repro`
(re-run `node setup-fixture.mjs`; npm prunes the fixture symlink).
