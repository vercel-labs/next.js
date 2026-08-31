# Reproduction attempt for vercel/next.js#98097

"A Suspense boundary is never hydrated when its child suspends on a streamed route"

Files are exactly the ones in the issue, plus:
- `app/probe/layout.tsx` + `app/probe/HydrationProbe.tsx`: the issue's own "control" — a client
  component OUTSIDE the boundary that polls the button inside it for a React fiber, hands-off.
- `app/probe2/*`: explicit `<Suspense>` in layout variant (issue bisection row 2).
- `probe.mjs`: hands-off Playwright check (no click, no focus, no visibilitychange) that reports
  `hydratedAtMs`, poll count and event counters, then clicks only after the observation window.

## Run

```
npm install
npx playwright install chromium
npm run build && npm start &   # http://localhost:3111 via: npx next start -p 3111
node probe.mjs                 # hands-off measurement
```

## Result observed here

`hydratedAtMs` is non-null within ~100–400 ms of load on every matrix cell tried
(next 16.3.3 and 16.4.0-canary.12, Turbopack and `--webpack` builds, suspension delays
30/300/1500/3000 ms, Node 24 and Node 25.9.0), with `visibility/focus/pointer` counters all 0 and
the `loading.tsx` fallback removed from the DOM. i.e. the reported non-hydration did not occur.

The only way this repo produced the reported symptom (buttons in the DOM, no `__react*` keys,
nothing in the console except a resource error) was when a client JS chunk request failed with
HTTP 500 (a stale `.next` served by an older server process).
