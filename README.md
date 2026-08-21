# Reproduction: `next dev` memory usage grows until the OS OOM-kills it (vercel/next.js#91396)

The reporter's link in the issue (`https://github.com/invalid`) is not a repository, so this is a
self-contained synthetic reproduction of the reported shape: **`next dev` RSS climbing to consume
all available RAM while pages are requested and files are edited**.

## What the app is

A generated App Router app: 150 `force-dynamic` routes, 3000 server components, 3000 CSS modules,
Tailwind 4 via `@tailwindcss/postcss` (~6k source files, comparable to a mid-size real project).
Nothing in the app retains state between requests.

## Run

```bash
npm install
node gen.mjs 150 20     # generate routes/components/css modules
bash measure.sh 120     # start next dev, churn edits+requests for 120s, print peak RSS
# variants:
bash measure.sh 120 -- --no-server-fast-refresh
bash measure.sh 120 -- --webpack
```

`measure.sh` writes per-cycle samples to `memory.csv` and the dev-server output to `dev.log`.
Each cycle rewrites 3 CSS modules + 3 components and requests 5 routes (server Fast Refresh path).

## Observed (2 vCPU / 4 GB Linux container, identical app and protocol)

| dev server | peak `next-server` RSS after 120 s |
|---|---|
| `next@16.0.11` (Turbopack) | 2609 MB |
| `next@16.2.10` (Turbopack) | 3703 MB, then **kernel OOM-kill** in a longer run |
| `next@16.2.10` (Turbopack, `--no-server-fast-refresh`) | 3750 MB |
| `next@16.3.1` (Turbopack) | 3584 MB |
| `next@16.3.1` (`--webpack`) | 2451 MB |

Growth is monotonic from ~0.5 GB at boot; it only stops when the container limit is reached.
In the 16.2.10 run the kernel killed it:

```
Out of memory: Killed process next-server (v1) total-vm:15431072kB, anon-rss:3880044kB
```

Notes:
- `--no-server-fast-refresh` (the workaround suggested in the issue thread) did **not** reduce peak
  RSS in this reproduction.
- Only 1-2 `.next/dev/build/*.js <port>` PostCSS worker children were ever alive, so the growth here
  is in-process (`next-server`), not the worker-multiplication variant described later in the thread.
