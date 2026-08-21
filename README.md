# Repro: next.js#91448 — `Invariant: Expected document.currentScript to be a <script> element. Received null instead.`

Turbopack's browser runtime instantiates the runtime module (which calls
`getAssetPrefix()` → `document.currentScript`) **after** `await Promise.all(otherChunks)`
in `registerChunk`. `document.currentScript` is only guaranteed to be set during
synchronous script evaluation, so as soon as that continuation is resumed from a
task instead of a microtask (slow chunk load, Android WebView 140, old Gecko /
Pale Moon microtask semantics) the read returns `null` and the app never hydrates.

## Run

```bash
npm install
npm run build
npm start            # http://localhost:3100
npm run check        # Playwright: chromium / firefox / webkit, with and without the deferred-continuation timing
```

`npm run check` loads the page twice per engine:

* `plain` — baseline, hydrates fine.
* `defer-chunk-await` — a tiny init script makes `Promise.all` resolve in a
  `setTimeout` task, which is exactly the timing the Turbopack runtime hits when
  the awaited chunk promise is not already settled in the current microtask
  checkpoint. Every engine then throws the reported `InvariantError` from
  `registerChunk` and the page stays `NOT HYDRATED`.

Expected output of the second run:

```
InvariantError: Invariant: Expected document.currentScript to be a <script> element. Received null instead.
    at getAssetPrefix
    at appBootstrap
    at instantiateModule
    at registerChunk
```

## Notes

* `app/layout.tsx` beacons uncaught client errors to `/api/client-error`, so the
  failure is also visible in the Next.js server log — useful for browsers that
  cannot be automated (see `scripts/run-palemoon.sh`).
* Real Pale Moon 34.3.2.1 (linux-x86_64-gtk3): the **production** build hydrates,
  i.e. that build no longer returns `null` in microtasks; `next dev` fails there
  for an unrelated reason (`getOrCreateDebugChannelReadableWriterPair`).
* Turning Turbopack off (`next dev --webpack`) avoids the code path entirely.
