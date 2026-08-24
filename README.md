# Reproduction: vercel/next.js#97811

`experimental.turbopackModuleFragments` panics on a bare hello-world App Router app.

## Run

```bash
npm install
npx next build --turbopack
```

## Observed (next@16.3.2 and next@16.4.0-canary.4, Node 24.17.0, Linux x64)

```
thread 'tokio-rt-worker' panicked at turbopack/crates/turbopack-ecmascript/src/module_fragments/graph.rs:746:16:
index out of bounds: the len is 8 but the index is 9
```

Followed by `Turbopack build failed with 14 errors`, each with debug chain
`EcmascriptModulePartAsset::select_part -> split_module -> index out of bounds`.
Exit code 1.

Removing `experimental.turbopackModuleFragments` makes the same app build successfully.
