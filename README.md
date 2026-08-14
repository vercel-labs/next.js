# vercel/next.js#97351 — prerender abort reason carries V8 stack frames

Verified reproduction bundle for https://github.com/vercel/next.js/issues/97351.
App and `repro.mjs` are from the reporter's repo
(devopsaptlife/nextjs-prerender-abort-retention @ b5e1d431); `retain-patch.mjs`,
`run-measure.sh` and the `drop=1` branch of `app/api/mem/route.js` were added to
quantify the cost inside real Next.js rather than in a mock.

Env verified on: Next 16.3.0, react 19.2.7, Node 24.17.0, linux x64.

## 1. Mechanism (standalone, no deps)

    node --expose-gc repro.mjs

Observed:

    payload per render: 8 MB x 20 renders = 160 MB
    baseline     retained while signals alive:  160 MB (of 160 MB)  -> PINNED;  after dropping signals: 8 MB
    materialize  retained while signals alive:    0 MB (of 160 MB)  -> released
    limit0       retained while signals alive:    0 MB (of 160 MB)  -> released

## 2. The path really fires in Next, and the reason really carries frames

    npm install
    npm run build
    npm run instrument   # hits.log gets one HIT_DYNAMIC_RENDERING per request
    npm start & curl -s localhost:3000/p/a > /dev/null

With `npm run patch` + `NEXT_ABORT_DUMP=1`, the reason's captured stack is:

    Error: Route /p/[slug] needs to bail out of prerendering at this point because it used `Date.now()`.
        at createPrerenderInterruptedError (next/dist/server/app-render/dynamic-rendering.js:410:41)
        at abortOnSynchronousDynamicDataAccess (dynamic-rendering.js:316:19)
        at abortOnSynchronousPlatformIOAccess (dynamic-rendering.js:342:5)
        at io (next/dist/server/node-environment-extensions/io-utils.js:32:78)
        at now (next/dist/server/node-environment-extensions/date.js:19:29)
        at d (.next/server/chunks/ssr/[root-of-the-server]__0z_j9ez._.js:1:248)   <- user component
        at eC (next/dist/compiled/next-server/app-page-turbo.runtime.prod.js:...) <- React renderer
        ... 3 more renderer frames

so `AbortSignal.reason` does hold renderer/user frames whose contexts are the
render's working set, exactly as the issue describes.

## 3. How much a retained signal actually costs in this app

    npm run build && npm run patch
    npm run measure:baseline
    npm run measure:fix

`retain-patch.mjs` pins every aborted prerender signal; `/api/mem?gc=1&drop=1`
releases them and re-GCs, so the delta is the retention attributable to the
signals alone. 200 requests, `heapUsed` after forced GC:

| mode | kept (200 signals) | dropped | attributable | per signal |
|---|---|---|---|---|
| baseline (frames kept) | 27.9 MB | 26.6 MB | 1.3 MB | ~6.5 KB |
| fix (`error.stack = ...`) | 27.7 MB | 26.6 MB | 1.1 MB | ~5.5 KB |

With a 13x bigger page (40k rows), 50 requests: baseline 0.6 MB vs fix 0.5 MB
attributable, i.e. ~12 KB vs ~10 KB per signal.

So the mechanism is real and the frames exist, but in this minimal app a
retained prerender signal pins ~6-12 KB, not ~1.7 MB — the reporter's 1,756 KiB
figure comes from a production heap snapshot where the frames' contexts held
`segmentData` buffers. Reproducing that magnitude needs an app whose render
working set is still reachable from the aborting frames.
