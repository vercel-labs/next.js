# Repro: `TypeError: __turbopack_context__.a is not a function` evaluating `postcss.config.js`

Reproduction for https://github.com/vercel/next.js/issues/97709 (Next.js 16.3.0, Turbopack production build).

## Run

```bash
npm install
npm run build   # node generate.js && next build (Turbopack)
```

`generate.js` writes `app/zz-txt/chain/m0..m299.js` and `app/zz-txt/late1..24.css`; it runs
automatically as part of `npm run build`.

Fails deterministically (every run locally) on `next@16.3.0` with the exact stack from the issue:

```
./app/zz-txt/late1.css
Error: Error evaluating Node.js code
TypeError: __turbopack_context__.a is not a function
    at mod (postcss.config.js_.loader.mjs:11:31) [.next/build/chunks/[root-of-the-server]__0_4nzr9._.js:56:30]
    at instantiateModule (turbopack:///[turbopack]/nodejs/runtime/runtime-base.ts:20:1) [.next/build/chunks/[turbopack]_runtime.js:744:9]
    ...
    [at .next/build/chunks/[turbopack-node]_transforms_postcss_ts_0lzwpx3._.js:9:16]
```

## Root cause (not the build cache)

`.next/build/chunks/[turbopack]_runtime.js` is a single file shared by every independent
per-transform graph in the turbopack-node execution context (here: the PostCSS transform and the
`turbopack.rules` webpack-loader transform).

In v16.3.0, `EcmascriptBuildNodeEntryChunk::runtime_chunk`
(`turbopack/crates/turbopack-nodejs/src/ecmascript/node/entry/chunk.rs`) omits the async-module
machinery (`contextPrototype.a = asyncModule`) whenever *its own* graph contains no async module:

```rust
let has_async_modules = if production { !self.module_graph.async_module_info().await?.is_empty() } else { true };
```

* the PostCSS graph is async (`postcss.config.js_.loader.mjs` does `await import(...)`) -> runtime **with** `.a`
* the webpack-loader graph has no async module -> runtime **without** `.a`

Both write the same path, so whichever finishes last wins. This repo forces the loader graph to be
emitted last (the `*.txt` module sits at the end of a 300-module import chain) and forces new PostCSS
pool workers to spawn afterwards (24 Tailwind entry CSS files imported at the end of that chain), so
those workers load a runtime without `.a` and every CSS entry fails.

Without the ordering forcing (e.g. CSS files spread over normal routes) the same project fails
intermittently, ~1 in 10-20 clean builds, matching the "intermittent, heals on redeploy" report.

## Versions

| next | result |
| --- | --- |
| 16.3.0 | fails 6/6 |
| 16.3.1 | passes 3/3 |
| 16.3.2 | passes 3/3 |
| 16.4.0-canary.0 | passes 3/3 |

Fixed in 16.3.1; canary carries the fix (`include_async_module_runtime = shared_runtime_chunk || has async`),
whose comment describes exactly this hazard.
