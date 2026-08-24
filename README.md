# Repro harness for vercel/next.js#97775

`extraChunksSignal` composite `AbortSignal` retention via `gcPersistentSignals`
(claimed 16.3 production regression, OOM after ~18h).

## What this measures

`instrument2.js` is a `--require` preload for the Next.js server process. It

* wraps `AbortSignal.any` and keeps a `WeakRef` to every composite it creates,
* keeps a `WeakRef` to every `ServerResponse` the HTTP server emits,
* on `SIGUSR2` runs `global.gc()` three times and prints how many composites and
  finished responses are still reachable, plus `heapUsed`/`rss`.

That is a direct, snapshot-free measurement of exactly the two quantities in the
report: pinned composites and retained request/response graphs.

## Run (production, the configuration in the report)

```bash
npm install
npm run build                                  # output: standalone, cacheComponents: true
cp -r .next/static .next/standalone/.next/
cd .next/standalone
PORT=3004 NODE_OPTIONS="--require ../../instrument2.js --expose-gc" node server.js &
cd ../..
node soak.mjs http://localhost:3004 600 16
kill -USR2 <pid of the node server.js process>   # report is printed on the server's stderr
```

## Result on this harness (Node 24.17, Linux)

| version | mode | requests | composites created | composites alive | finished responses alive | heapUsed |
|---|---|---|---|---|---|---|
| 16.3.2 | standalone prod | 801 | 0 | 0 | 0 | 28.4 MB |
| 16.3.2 | standalone prod, `export const instant = true` | 800 | 0 | 0 | 0 | 28.5 MB |
| 16.4.0-canary.3 | standalone prod | 600 | 0 | 0 | 0 | 28.1 MB |
| 16.3.2 | `next dev` | 400 | 1 | 0 | 399 | 173 MB |
| 16.2.12 | `next dev` | 400 | 0 | 0 | 400 | 195 MB |

The production server never calls `AbortSignal.any` at all, so no composite
(and no `gcPersistentSignals` entry) can be created there, and no finished
response is retained.

The dev-server retention of finished responses is identical on 16.2.12, i.e. it
predates 16.3 and is not the reported regression.

## Why the production server cannot hit that call site

`validateAtDepthImpl` (the `extraChunksController` / `extraChunksSignal` code) is
only reached from:

1. `runValidationInDev` <- `runDevValidationInBackground` <- `stagedRenderWithCachesInDev`,
   which is called only from the two `process.env.__NEXT_DEV_SERVER && ... cacheComponents`
   branches in `app-render.js` (HTML render and `generateDynamicFlightRenderResultWithStagesInDev`), and
2. the build-time instant-validation path, which passes `validationAbortSignal === undefined`
   and therefore uses `extraChunksController.signal` directly — no composite, no
   `gcPersistentSignals` entry.

In an installed `next@16.3.2`, `dist/compiled/next-server/app-page.runtime.prod.js`
(the bundle the production/standalone server loads) contains **0** occurrences of
`__NEXT_DEV_SERVER`; the dev bundle contains 13. The dev-gated staged render and
its background validation are compiled out of the production server bundle.
The report inspected `dist/server/app-render/app-render.js`, which is the
unbundled source shared by dev, build and prod, not the bundle prod runs.
