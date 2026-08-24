# Reproduction for vercel/next.js#97811

`experimental.turbopackModuleFragments` panics with `index out of bounds` in
`turbopack/crates/turbopack-ecmascript/src/module_fragments/graph.rs:746` while
splitting Next.js' own internal modules, on a bare hello-world App Router app.

## Run

```bash
npm install
npm run build
```

## Observed

```
thread 'tokio-rt-worker' panicked at turbopack/crates/turbopack-ecmascript/src/module_fragments/graph.rs:746:16:
index out of bounds: the len is 8 but the index is 9
...
> Build error occurred
Error: Turbopack build failed with 14 errors:
./node_modules/next/dist/esm/server/app-render/create-error-handler.js:4:1
Error: Module not found: Can't resolve '../pipe-readable'
Debug info:
- Execution of EcmascriptModulePartAsset::select_part failed
- Execution of split_module failed
- index out of bounds: the len is 8 but the index is 9
```

Exit code 1. Reproduced on next@16.3.2 and next@16.4.0-canary.4
(Node 24.17.0, Linux x86_64). Removing `turbopackModuleFragments` makes the
build succeed.
