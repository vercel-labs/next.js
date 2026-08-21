# Repro: `RangeError: Map maximum size exceeded` in `AsyncHook.init` (next.js#96140)

React's dev-only Server Components async tracking is bundled into
`next/dist/compiled/next-server/app-page-turbo.runtime.dev.js`. At module load it
unconditionally enables a **process-global** `async_hooks` hook:

```js
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId, resource) { /* ... */ pendingOperations.set(asyncId, trigger) },
  before(asyncId) { /* ... */ },
  promiseResolve(asyncId) { /* ... */ },
  destroy(asyncId) { pendingOperations.delete(asyncId) },
}).enable()
```

`pendingOperations` is a plain `Map` with **no size cap**; the only removal is
`destroy`, which for `PROMISE` resources Node emits **only after GC**. If the map
ever reaches V8's hard `Map` limit (2^24 = 16,777,216 entries), `Map.set` throws
inside the async hook — uncatchable — and `next dev` exits with code 1.

Verified `2 × pendingOperations.set`, `2 × .delete`, `0 × .size` checks in
16.2.11 and in 16.3.1-canary.26.

## Setup

```bash
npm install
```

## A. Observe the map (does it grow?)

```bash
node instrument.cjs                                    # exposes globalThis.__nextPendingOperations (read-only)
NODE_OPTIONS="--expose-gc --max-old-space-size=8192" npx next dev --turbopack -p 3000
curl localhost:3000/                                   # load the app-page dev runtime once
node loadgen.mjs                                       # heavy traffic, prints map size every 500 reqs
node trickle.mjs                                       # reporter's scenario: 1 req/s, no forced GC
```

`GET /api/monitor` reports `trackedBeforeGc` / `trackedAfterGc` (`?gc=0` skips the
forced GC).

Measured on Linux / Node 24.17 / next 16.2.11:

* trickle (1 req/s): sawtooth, ~810 entries added per request, GC drops it back to
  a few hundred; no monotonic growth.
* heavy load (8 concurrent, 40k requests, 8 GB heap): plateau ~207k entries live,
  ~25k after a forced GC, heap steady at ~114 MB. Two orders of magnitude below 2^24.

## B. Reproduce the crash by simulating the 2^24 cap

`instrument.cjs CAP=<n>` swaps the `Map` for a subclass that throws
`RangeError: Map maximum size exceeded` at `n` entries — exactly what V8 does at
2^24 — so the failure mode is observable in seconds instead of hours:

```bash
CAP=150000 node instrument.cjs
NODE_OPTIONS="--max-old-space-size=8192" npx next dev --turbopack -p 3001
curl localhost:3001/
BASE=http://localhost:3001 node loadgen.mjs
```

Dev server output:

```
RangeError: Map maximum size exceeded
    at Map.set (.../next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:53:263029)
    at AsyncHook.init (.../next/dist/compiled/next-server/app-page-turbo.runtime.dev.js:53:270790)
    at emitInitNative (node:internal/async_hooks:206:43)
    at emitInitScript (node:internal/async_hooks:513:3)
    at promiseInitHook (node:internal/async_hooks:332:3)
    at promiseInitHookWithDestroyTracking (node:internal/async_hooks:336:3)
EXITCODE=1
```

Restore the pristine runtime with:

```bash
cp node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js.orig \
   node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js
```
