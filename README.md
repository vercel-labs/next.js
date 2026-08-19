# Repro: Turbopack `next build` fails fatally on node-pre-gyp packages without `napi_versions` (duckdb)

Upstream issue: https://github.com/vercel/next.js/issues/97538

## Run

```bash
npm install --ignore-scripts   # --ignore-scripts only to skip the native duckdb download; irrelevant to the bug
npx next build                 # Turbopack (default): FATAL TurbopackInternalError
```

## Observed (next@16.3.1-canary.24, also 16.1.6)

```
Error [TurbopackInternalError]: Failed to write app endpoint /page
Caused by:
- [project]/node_modules/duckdb/lib/duckdb-binding.js [app-rsc] (ecmascript)
- missing field `napi_versions` at line 17 column 3
...
- Execution of <NodePreGypConfigReference as ModuleReference>::resolve_reference failed
```

Still fails with `serverExternalPackages: ['duckdb']` (included in `next.config.ts`).
`next build --webpack` gets past bundling (no internal error).

## Cause

`turbopack/crates/turbopack-resolve/src/node_native_binding.rs`:

```rust
struct NodePreGypConfig {
    module_name: String,
    module_path: String,
    napi_versions: Vec<u32>, // required by serde, optional in node-pre-gyp
}
```

duckdb's `binary` config has only `module_name`, `module_path`, `host`.
