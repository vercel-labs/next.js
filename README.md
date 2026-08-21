# Repro: next build static workers strip `--max-old-space-size` (isolatedMemory) — vercel/next.js#95745

Mirror of https://github.com/alexboii/next-build-worker-oom plus `probe.cjs`, an
instrumentation shim that prints each process's real V8 heap limit (loaded via
`--require`, which survives the strip since only the two `max-old-space*` keys are
deleted in `packages/next/src/lib/worker.ts`).

App: 12 modules allocating ~150MB each at import time, 30 Pages Router pages with
`getStaticProps` importing all of them. `experimental.cpus` is set from `BUILD_CPUS`.

## Run (no Docker needed; sized for a 4GB / 2 vCPU box)

```bash
npm install --no-audit --no-fund
export NODE_OPTIONS="--max-old-space-size=512 --require $PWD/probe.cjs"

# A) one worker: passes even though the worker resident-allocates ~1.8GB with a 512MB "cap"
BUILD_CPUS=1 npx next build

# B) five workers: kernel OOM-kill, cap has no effect
rm -rf .next && BUILD_CPUS=5 npx next build
```

## Observed (next 16.3.0-preview.5, node 24, 4GB/2 vCPU)

```
[probe] pid=794 IS_NEXT_WORKER=-    heap_limit=704MB  NODE_OPTIONS="--max-old-space-size=512 --require .../probe.cjs"
[probe] pid=828 IS_NEXT_WORKER=true heap_limit=2240MB NODE_OPTIONS="--require=.../probe.cjs --enable-source-maps"
```

Parent honors the cap (704MB); the static/page-data worker gets the V8 default
(2240MB) and its `NODE_OPTIONS` no longer contains the flag.

Run B: `Collecting page data using 5 workers ...` then
`⨯ Next.js build worker exited with code: null and signal: SIGKILL`, with
`Out of memory: Killed process ... (MainThread)` in `dmesg`.

Source: `createStaticWorker` passes `isolatedMemory: true`
(`packages/next/src/build/index.ts`), `worker.ts` does
`delete nodeOptions['max-old-space-size']`, and jest-worker's
`workerIdleMemoryLimit` is not plumbed through anywhere in `packages/next/src`.
