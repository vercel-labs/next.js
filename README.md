# Reproduction attempt for vercel/next.js#98023

> Turbopack dev: PostCSS worker runs with the wrong cwd when an ancestor
> `package.json` exists, then spawns workers past the pool bound until OOM

The original issue was closed by the bot for missing a reproduction. This
repository is a minimal, self-contained harness that sets up exactly the
described layout so the claim can be measured on any machine.

## Layout

```
parent/
  package.json        <- ancestor package.json (the reported trigger)
  app/                <- Next.js 16.2.4 app-router project, Tailwind v4 via @tailwindcss/postcss
    postcss.config.mjs
    cwd-probe/        <- local PostCSS plugin: prints process.cwd() of the worker
                         and whether `tailwindcss` resolves from it
```

## Run

```sh
cd parent/app && npm install && cd ../..

./scripts/run.sh            # ancestor package.json only
./scripts/run.sh lockfile   # ancestor package.json + lockfile -> Next infers the
                            # ancestor as the workspace root
```

The script starts `next dev` (Turbopack), issues one `GET /` to trigger the CSS
compile, then samples `pgrep -fc "dev/build/postcss"` and total RSS for 30s and
prints the peak worker count. It aborts if the worker count passes 200.

## What was observed here (Linux x64, 2 cores, 4 GB, Node 24.17.0)

| scenario | worker cwd | `tailwindcss` resolves | peak postcss procs | result |
|---|---|---|---|---|
| no ancestor `package.json` | `.../parent/app` | yes | 1 | `GET / 200` |
| ancestor `package.json` | `.../parent/app` | yes | 1 | `GET / 200` |
| ancestor `package.json` + lockfile (root inferred as `parent`) | `.../parent/app` | yes | 1 | `GET / 200` |
| same, `next@16.4.0-canary.10` | `.../parent/app` | yes | 0-1 | `GET / 200` |

Even when Next.js logs

```
⚠ Warning: Next.js inferred your workspace root ...
 We detected multiple lockfiles and selected the directory of .../parent/package-lock.json as the root directory.
```

the PostCSS worker still reports

```
POSTCSS_WORKER_CWD=/.../parent/app
RESOLVE_TAILWIND_FROM_CWD=/.../parent/app/node_modules/tailwindcss/dist/lib.js
```

so neither `Can't resolve 'tailwindcss' in <ancestor>` nor unbounded worker
growth occurred. Additional probes on the same setup:

* A PostCSS plugin that throws on every `Once()` (10 forced recompiles) produced
  10 clean errors, peaked at 2 worker processes (= `available_parallelism()`),
  and left 0 processes behind — no leak of failing workers.
* A postcss config naming a nonexistent plugin produced one
  `Cannot find module` error per compile and 0 lingering workers.

The reported storm (98 processes / 6.8 GB) was measured on 16 cores; this
machine only has 2, so a core-count dependent amplification cannot be excluded.
Run `./scripts/run.sh lockfile` on a 16-core box to check that.

The stack trace in the report points at the app's own
`node_modules/enhanced-resolve`, which the Turbopack PostCSS worker path does
not use (it fails through `node:internal/modules/cjs/loader` and
`[turbopack-node]/transforms/postcss.ts:49`), so the reporter's project likely
has an additional resolver in the chain that this minimal app does not.
