# Repro: Turbopack `next build` deadlocks at 0% CPU on a Web Worker chunk-group reference cycle

Minimal reproduction for https://github.com/vercel/next.js/issues/97399 (the linked
repo in that issue does not reproduce). Default config, no experimental flags,
5 files.

## Run

```bash
npm install
npx next build      # hangs forever at "Creating an optimized production build ..." at 0% CPU
```

Controls that all pass:

```bash
npx next dev              # works (dev chunk paths are ident-based, not content-hashed)
npx next build --webpack   # completes in seconds
```

## Shape

* `app/page.js` (client component) spawns `new Worker(new URL('../modules/w1.js', import.meta.url))`.
* `modules/w1.js` spawns `new Worker(new URL('./w1.js', import.meta.url))` — i.e. itself.

A two-file ring (`w1` -> `w2` -> `w1`) hangs identically; an acyclic chain
(`w1` -> `w2`, no back edge) builds fine.

## Why this forms the cycle described in #97399

`WorkerLoaderModule::chunk_group` creates the worker chunk group with
`AvailabilityInfo::root()`
(`turbopack/crates/turbopack-ecmascript/src/worker_chunk/module.rs`), so — unlike
`import()`, where availability info grows along the path and terminates the
recursion — the worker group for `w1` is identical no matter who references it.
The worker loader embeds the target group's chunk file names via
`chunks_data` -> `ChunkData::from_assets` -> `chunk.path()`, and in a production
client build `chunk_path` hashes the chunk's own content
(`ContentHashing::Direct`). So chunk(w1) content -> path(chunk(w1)) -> content of
chunk(w1): an await cycle, and turbo-tasks has no cycle detection, hence a silent
park at 0% CPU.

## Observed

* `next build` never finishes; whole process tree consumes 0 CPU jiffies over
  minutes, RSS flat, 14 idle tokio threads.
* Reproduced on `next@16.3.1` and `next@16.3.1-canary.19`, linux x64, Node 24.
