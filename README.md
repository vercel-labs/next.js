# Repro harness for vercel/next.js#97776 — `extraChunksSignal` composite AbortSignal retention

Minimal Cache Components (PPR) app + a leak probe that measures whether composite
`AbortSignal`s (created via `AbortSignal.any`) survive a forced GC.

## How the probe works

`instrument.js` is preloaded with `--require` and `--expose-gc`. It wraps
`AbortSignal.any`, tags every composite by the Next.js function that created it
(from the creation stack), keeps a `WeakRef` to it, and every 5s runs
`global.gc()` twice and logs how many composites are still alive:

```
[SIGNALS pid=…] created=<total> alive=<not collectable> heapUsed=… <tag>=<count>
```

A retained (leaked) composite shows up as a monotonically growing `alive` count.
This is strictly stronger than heap-snapshot counting: `alive` is post-GC reachability.

## Run

```
npm install

# dev
NODE_OPTIONS="--require $PWD/instrument.js --expose-gc" npx next dev -p 3000
for i in $(seq 1 60); do curl -s -o /dev/null "http://localhost:3000/jobs?i=$i"; done
node nav.js            # 120 real client navigations with Playwright

# production (standalone, as in the report)
NODE_OPTIONS="--require $PWD/instrument.js --expose-gc" npx next build
NODE_OPTIONS="--require $PWD/instrument.js --expose-gc" PORT=3100 node .next/standalone/server.js
for i in $(seq 1 350); do curl -s -o /dev/null "http://localhost:3100/jobs/uniq-$i"; done
```

## Result on next@16.3.2 / Node 24.17.0 (Linux)

| mode | requests | composites created | alive after forced GC | heapUsed |
|---|---|---|---|---|
| `next dev` | 60 HTML + 120 client navigations | 478 | 1 (in-flight) | flat, ~56 MB |
| standalone prod (`node .next/standalone/server.js`) | 350 | **1** | 1 | flat, ~32 MB |

* `extraChunksSignal` composites *are* created in `next dev`
  (`extraChunksSignal(validateAtDepthImpl)` tag) and are all released by GC after
  the render settles — no accumulation.
* In production the `validateAtDepthImpl` call site never runs: in
  `app-render.js` the chain
  `generateDynamicFlightRenderResultWithStagesInDev` → `stagedRenderWithCachesInDev`
  → `runDevValidationInBackground` → `validateInstantConfigs` → `validateAtDepthImpl`
  is gated by `process.env.__NEXT_DEV_SERVER`. The only composite created in the
  production run comes from `use-cache-wrapper` (`AbortSignal.any([dynamicAccessAbortSignal,
  timeoutAbortController.signal])`, work-unit store `type: 'prerender'`) — i.e. the
  site of #97363, not the instant-validation site.
