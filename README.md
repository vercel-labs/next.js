# next#98094 — App Router: client-aborted requests retain memory permanently

Minimal reproduction of https://github.com/vercel/next.js/issues/98094.

## What it shows

The *same* production server, the *same* 3,000 URLs, only the client behaviour differs:

| run (3,000 requests, 50 concurrent) | heapUsed after forced GC + 100s idle | external | RSS |
|---|---|---|---|
| completed (`curl` waits) | **82 MB** | 4 MB | 313 MB |
| aborted at 400 ms (`--max-time 0.4`) | **180 MB** | **333 MB** | 745 MB |

Nothing is reclaimed by 4 forced `global.gc()` passes or 100 s of idle.
At a smaller dose (400 aborts) the retention is ~600 KB per aborted request, matching the report.

## Required ingredient: a *cached* `fetch()` inside the aborted render

Same protocol, same page, only the data-fetch flavour changed (Next 16.4.0-canary.12):

| page does | heapUsed retained after 3,000 aborts |
|---|---|
| no `fetch()` (pure async delay + big payload) | 28 MB = baseline, **no leak** |
| `fetch(..., { cache: 'no-store' })` | 46 MB (+15 MB, small residual) |
| `fetch(..., { next: { revalidate: 60, tags: [...] } })` | **180 MB heap + 333 MB external** |

## Run

```bash
npm install && npm run build
PORT=3000 NODE_OPTIONS=--expose-gc npx next start -p 3000 &
./protocol.sh abort 3000      # leaks
# then restart the server and run the control:
./protocol.sh complete 3000   # returns to baseline
```

`/api/mem?gc=1` forces 4 GCs and reports `process.memoryUsage()`.
`/api/mem?snapshot=NAME` writes a heap snapshot (see below).

## Heap snapshot analysis (400 aborts, canary)

- 144 MB in 2,553 `system / JSArrayBufferData` buffers
- retaining path: `global.fetch` → `_nextOriginalFetch` closure context → WeakMap entry → per-request `Map` → undici `_Response` → `InternalReadableByteStream` → `ReadableByteStreamController.queue` → `ArrayBuffer`
- ~800 live undici `_Response` objects (≈2 per aborted request) with **unread body streams**
- strongly-reachable WeakMap keys scale 1:1 with aborts: 798 `JSProxy`, 398 `Array`, 397 `Promise` for 400 aborts

i.e. when the render is aborted, the patched/cached `fetch` response bodies (and the per-request structures keyed off them) are never drained or released.

## Versions measured (identical protocol)

| next | heapUsed retained / RSS after 3,000 aborts |
|---|---|
| 16.2.12 | 616 MB / 1,130 MB |
| 16.3.3 | 181 MB / 771 MB |
| 16.4.0-canary.12 | 180 MB / 745 MB |

Node 24.17, Linux, `next start` (production), no `cacheComponents`.
