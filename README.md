# next.js#97348 — abort-reason Error's V8 stack frames pin the aborted render's working set

Runs Next.js **16.3.0's own** `dynamic-rendering.js` abort path (no app, no network,
deterministic) and measures what `global.gc()` can reclaim while only the `AbortSignal`
survives the "request".

```bash
npm install
node --expose-gc repro-next-internals.mjs
```

Observed (Node 24.17.0, next 16.3.0):

```
baseline        retained while signals alive:  160 MB of 160 MB -> PINNED
delete-stack    retained while signals alive:  160 MB of 160 MB -> PINNED
defineProperty  retained while signals alive:  160 MB of 160 MB -> PINNED
set-stack       retained while signals alive:    0 MB of 160 MB -> released
materialize     retained while signals alive:    0 MB of 160 MB -> released
limit0          retained while signals alive:    0 MB of 160 MB -> released
bare abort() (DOMException reason) retained: 160 MB of 160 MB
```

* `abortOnSynchronousPlatformIOAccess` -> `abortOnSynchronousDynamicDataAccess` ->
  `createPrerenderInterruptedError()` (real Next code) makes the reason; it stays reachable as
  `signal.reason` with its structured stack trace never materialized, so the frame that called it
  (holding the `{ html, kind, postponed, rscData, segmentData, status }` page value) cannot be
  collected.
* `reason.name === 'Error'`, `digest === 'NEXT_PRERENDER_INTERRUPTED'`.
* A bare `controller.abort()` (the ~18 other abort sites in `app-render.js`) retains identically
  via the synthesized `DOMException`.
* `delete err.stack` and `Object.defineProperty(err, 'stack', {value})` do **not** release;
  `err.stack = ...` (setter), reading `.stack`, or `Error.stackTraceLimit = 0` do.

Caveat measured here: retention is not strictly binary in `stackTraceLimit` — it depends on
whether the payload-holding frame is still inside the captured window. In this script the
payload frame is 4 frames deep, so limits 3/1/0 all release while 10 pins.

`repro-mechanism.mjs` is the reporter's original standalone model (no Next dependency); it
reproduces as reported.
