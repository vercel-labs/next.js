# Reproduction attempt for vercel/next.js#97423

`next dev` (Turbopack) reportedly forks `node .next/dev/build/<hash>.js <port>` pool workers in an
unbounded respawn loop on **Windows 11 native** (32 cores, 64 GB), reaching thousands of live
`node.exe` processes and exhausting memory. The reporter could not share a project, so this is a
minimal stand-in: App Router + Tailwind v4 through `@tailwindcss/postcss` + `output: 'standalone'`,
which is the setup that forces PostCSS to be evaluated inside a Turbopack Node.js pool worker.

## Run

```bash
pnpm install
pnpm dev                       # terminal 1
node scripts/hammer.mjs 15     # terminal 2: request every route, churn globals.css / postcss.config
node scripts/count-workers.mjs # terminal 3: sample live pool workers, node process count, node RSS
```

`scripts/count-workers.mjs` prints one line per sample, e.g.
`poolWorkers=1 nodeProcesses=4 nodeRssGB=0.61`, and exits with code 2 if pool workers exceed
`ABORT_AT_POOL_WORKERS` (default 250), i.e. the runaway described in the issue.

`windows-ci.yml` is a ready-to-use `workflow_dispatch` workflow (copy it to
`.github/workflows/`) that runs the same sequence on `windows-latest` and `ubuntu-latest` and
uploads the sampled counts plus the dev-server log.

## Result of this reproduction

Not reproduced with next@16.2.11 on Linux (2 cores, `poolWorkers` never exceeded 2 == core count
over 8 rounds of route traffic + CSS edits + PostCSS config touches; a PostCSS plugin that calls
`process.exit(1)` produced a single fatal `unexpected end of file` error instead of a respawn loop,
and appending to the emitted `.next/dev/build/<hash>.js` did not respawn anything).

Turbopack sizes pool concurrency from `available_parallelism()`
(`turbopack/crates/turbopack-node/src/evaluate.rs`), the numeric child argument is the worker's TCP
port (`process_pool/mod.rs`), and cleanup of dropped workers relies on tokio `kill_on_drop(true)`
- so a high core count and/or Windows-specific process cleanup / file watching is likely required
to hit the reported runaway. Run `windows-ci.yml` on a many-core Windows machine to check.

next@16.3.1 behaves the same here (one live worker); its worker entrypoint moved to
`.next/dev/build/chunks/pool_entry-[turbopack-node]_transforms_postcss_ts_*.js <port>`.
