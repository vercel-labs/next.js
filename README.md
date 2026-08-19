# next dev: memory growth per App Router page render (issue #97555)

Reproduction harness for https://github.com/vercel/next.js/issues/97555.

The original report had no repository link. This is a minimal `create-next-app`
App Router app plus the two CDP probes used to measure the dev server.

## Setup

```bash
npm install
npm run dev            # Next.js 16.3.1, Turbopack, dev mode
```

Then open the inspector on the **`next-server` child process** (not the
`next dev` wrapper):

```bash
kill -USR1 "$(pgrep -f 'next-server')"
```

## Probe A — per-render retention (the report's script)

```bash
node probe.mjs                                  # 3 rounds x 30 renders of /
TARGET_URL=http://localhost:3000/big node probe.mjs   # 1.7 MB flight payload
```

`probe.mjs` forces `HeapProfiler.collectGarbage` before and after each batch,
so it reports retained heap and `number_of_native_contexts`.

## Probe B — soak

```bash
TARGET_URL=http://localhost:3000/ BATCH=500 BATCHES=30 node soak.mjs
```

Prints `used_heap_size` after a forced full GC, plus RSS, every 500 renders.

## What was measured (Node v22.21.1, Linux, next 16.3.1, Turbopack)

* `vm.runInNewContext` in `evalManifest`
  (`next/dist/server/load-manifest.external.js`) really does run **once per
  request** in dev, because the app-page route module passes
  `shouldCache: !this.isDev` for `*_client-reference-manifest.js`. Instrumenting
  that call site logs exactly one eval per page request.
* Those native contexts are **reclaimable**: `number_of_native_contexts` is seen
  as high as `+505` right after a 500-request batch, but a forced full GC brings
  it back to the baseline (5-6) and `number_of_detached_contexts` stays `0`.
* Retained heap per render is **~0.008-0.05 MB**, not ~3.9 MB. A page whose
  flight payload is 1.7 MB retains no more than the `hello` page, so the render
  payload itself is not retained.
* Memory still grows monotonically under sustained rendering: over 9,000 renders
  of a one-paragraph page, heap-after-forced-GC went 63.8 MB -> 188 MB and RSS
  269 MB -> 840 MB, with no plateau.
