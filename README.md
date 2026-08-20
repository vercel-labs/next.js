# Repro for vercel/next.js#64471 — instrumentation cannot import a native (.node) module

`instrumentation.ts` imports `@napi-rs/tar`, a package with a N-API `.node` binding.

## Run

```bash
npm install
npm run build          # fails: Turbopack build failed with 3 errors
# or
npm run dev            # then open http://localhost:3000
```

## Observed (Next.js 16.3.1-canary.25, Turbopack)

`next build` fails with 3 errors, including:

- `Edge Instrumentation: ./node_modules/@napi-rs/tar/browser.js` → `Module not found: Can't resolve '@napi-rs/tar-wasm32-wasi'`
- `Instrumentation: ./node_modules/@napi-rs/tar/index.js` → `non-ecmascript placeable asset: ... tar.linux-x64-gnu.node (node addon) is not placeable in ESM chunks`

`next dev` logs the same Edge Instrumentation module-not-found error and then:

```
Error: An error occurred while loading instrumentation hook: Cannot find native binding.
  [cause]: Error: could not resolve "@napi-rs/tar-linux-x64-gnu" into a module
    [cause]: Error: Cannot find module './tar.linux-x64-gnu.node'
```

Setting `serverExternalPackages: ['@napi-rs/tar']` makes the Node.js hook run
(`instrumentation register, tar.Entry = [Function: Entry]`), but the Edge
instrumentation is still compiled and errors, and `GET /` returns 500.

## Expected

`instrumentation.ts` should be able to import a native Node addon; the instrumentation
file should not be bundled for the Edge runtime when the project has no Edge runtime code,
and native addons should be externalized instead of bundled.
