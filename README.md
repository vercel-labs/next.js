# Repro for vercel/next.js#96619 — two Turbopack Node.js pools overwrite one `[turbopack]_runtime.js`

Based on the reporter's repro (https://github.com/finnan444/nextjs-turbopack-runtime-pool-race,
commit `59a2a0c`), plus `swap.sh`, which turns the intermittent build failure into a
deterministic one.

```bash
npm install
./ab.sh      # two divergent runtime variants written to the same path
./loader.sh  # .js postcss config emits the top-level-await loader, .cjs does not
./swap.sh    # deterministic: real postcss pool entry vs each runtime variant
./repro.sh 5 # N cold builds (stays green in this minimal app — the race is load dependent)
```

## Verified (Linux x64, 2 cores, Node v24.17.0)

`next@16.3.0` — bug present:

```
== A: postcss pool only (no .scss import) ==
  asyncModule occurrences: 2
  runtime size: 36110 bytes
  pools spawned: 1  pool_entry-[turbopack-node]_transforms_postcss_ts_*._.js
== B: webpack-loaders (sass) pool only (postcss.config.js removed) ==
  asyncModule occurrences: 0
  runtime size: 31680 bytes
  pools spawned: 1  pool_entry-[turbopack-node]_transforms_webpack-loaders_ts_*._.js
== both pools in one build ==
  2 pools, one .next/build/chunks/[turbopack]_runtime.js — last writer wins
```

`swap.sh` runs the *real emitted* postcss pool entry against each runtime (dummy IPC server on
`argv[2]`):

```
== postcss runtime in place ==         ok: config loader evaluated
== webpack-loaders runtime in place == FAIL: TypeError: __turbopack_context__.a is not a function
                                             at [root-of-the-server]__*._.js:56
```

`next@16.3.1` and `next@16.3.1-canary.26` — both pools now emit a byte-identical 36110 B runtime
containing `asyncModule` (x2), and `swap.sh` reports `ok` for both variants. The reported
divergence appears fixed in 16.3.1; only 16.3.0 (and 16.3.1-canary.0, per the report) diverge.
