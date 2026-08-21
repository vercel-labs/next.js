# Repro: vercel/next.js#78592 — `this.emitFile is not a function` with `file-loader` in Turbopack

App Router page imports a `.wasm` file that is handled by `file-loader` through
`turbopack.rules`, as in the original report and in the maintainer suggestion
(`as: '*.js'`).

## Run

```bash
pnpm install

# FAILS: file-loader + `as: '*.js'` (maintainer-suggested config)
WASM_MODE=as-js pnpm next build --turbopack

# FAILS: file-loader without `as` (config from the original report)
WASM_MODE=no-as pnpm next build --turbopack

# FAILS in dev too (GET / returns 500)
WASM_MODE=as-js pnpm next dev --turbopack

# WORKS: webpack build with the same file-loader rule
pnpm next build --webpack

# WORKS: Turbopack built-in asset rule
WASM_MODE=asset-type pnpm next build --turbopack

# WORKS: new URL('...wasm', import.meta.url) -> /new-url route
```

Observed with next@16.3.1-canary.25:

```
./src/assets/add.wasm
Error: Error evaluating Node.js code
TypeError: this.emitFile is not a function
  (from node_modules/file-loader/dist/cjs.js)
```

With `WASM_MODE=no-as` two extra errors follow
(`Export default doesn't exist in target module` for
`src/assets/add.wasm [app-client] (wasm module)`).

The original `failed to convert rope into string / invalid utf-8 sequence`
panic from the report no longer appears on current canary.
