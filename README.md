# next#97363 — `use cache` wrapper never releases its `AbortSignal.any` composite

Reproduction for https://github.com/vercel/next.js/issues/97363 (Next 16.3.0, `cacheComponents: true`,
`output: standalone`). Derived from the reporter's repo
(https://github.com/devopsaptlife/nextjs-prerender-abort-retention) with an automated driver, because
the 40-request snippet in the issue often finishes before any composite is created.

## Run

```bash
npm install
npm run build
npm run repro                  # leaky: STILL ALIVE === created
```

Observed (Node 24.17.0, Next 16.3.0):

```
round 1: composites created 14,  STILL ALIVE after 3 forced GCs 14  | live AbortSignals 157,  arrayBuffers 50 MB,  rss 286 MB
round 3: composites created 51,  STILL ALIVE after 3 forced GCs 51  | live AbortSignals 564,  arrayBuffers 142 MB, rss 467 MB
round 6: composites created 108, STILL ALIVE after 3 forced GCs 108 | live AbortSignals 1191, arrayBuffers 266 MB, rss 749 MB
```

100% of the composites survive three forced full GCs, and `arrayBuffers` / RSS grow linearly with them.

## Candidate fix, measured on the same build

```bash
npm run build
npm run repro:with-detach-fix  # patches the built chunk to remove the abort listener after prerender()
```

```
round 1: composites created 6,  STILL ALIVE 0 | live AbortSignals 3, arrayBuffers 41 MB, rss 247 MB
round 6: composites created 79, STILL ALIVE 0 | live AbortSignals 3, arrayBuffers 74 MB, rss 293 MB
```

`arrayBuffers` stops ratcheting and the live `AbortSignal` population stays at 3 instead of ~1200.

## Where

`dist/server/use-cache/use-cache-wrapper.js` (bundled into the app's SSR chunk), `prerender` /
`prerender-runtime` branch of `generateCacheEntryImpl`:

```js
const abortSignal = dynamicAccessAbortSignal
  ? AbortSignal.any([dynamicAccessAbortSignal, timeoutAbortController.signal])
  : timeoutAbortController.signal
const { prelude } = await prerender(…, { signal: abortSignal, … })
clearTimeout(timer)   // the timer is cleared; the abort listener prerender() attached is not
```

Node keeps a composite from `AbortSignal.any()` in its process-global `gcPersistentSignals` set while
any abort listener is attached, so the listener closure keeps the finished cached render reachable.

A composite is only built when a request triggers a runtime fallback-shell prerender (outer work unit
store type `prerender`), which is why `generateStaticParams` on the route is required: without it the
wrapper takes the `: timeoutAbortController.signal` branch.

## Files

- `app/p/[slug]/page.jsx` — `"use cache"` component + `generateStaticParams` + an uncached `headers()` read
- `preload-any.cjs` — `--require` shim that counts `AbortSignal.any` calls and holds only `WeakRef`s
- `drive.mjs` — starts the standalone server, crawls in rounds, forces 3 GCs over CDP, reports live composites
- `check-composites.mjs` — one-shot version of the same check against an already-running server
- `patch-detach-fix.mjs` — removes the abort listener in the built output where the timer is cleared
- `app/api/mem/route.js` — `rss` / `arrayBuffers` / live `AbortSignal` counts via `v8.queryObjects`
