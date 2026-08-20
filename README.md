# Repro harness for vercel/next.js#55735 — "navigation delayed for 60 seconds"

Mirror of the reporter's app (https://github.com/andrew-gropyus/next-hydration-issue @ 26b7eb9a83fef0f387cd6655e996136695c963c6)
plus an automated Playwright harness that tries to hit the reported race
(reload `/en/red`, then click the `/en/blue` Link a few ms later).

## Run

```
npm install            # lockfile-free; use `npm i next@13.5.3-canary.0` to match the report
npm run build && npm run start          # port 3000
node sweep.mjs                          # deterministic delay sweep (0..150ms, 5ms steps)
BUDGET=170 node stress.mjs              # randomized CPU-throttle / latency / click-delay trials
```

Both scripts print, per trial, the time from click until "Blue is the best colour" is
visible, whether the navigation stayed in the same document (client-side nav) and whether
the `/en/blue` request was `document` (browser default nav, link not yet hydrated) or
`fetch` (RSC, router intercepted the click).

## Result in this sandbox (linux, Chromium 151, headless and headed under Xvfb)

- next 13.5.3-canary.0 (the reported version, from the reporter's lockfile): ~360 trials, max
  click->render 1446ms, no 60s stall.
- next 16.3.1-canary.25 + react 19.2.8: ~157 trials, max 1160ms, no stall.
- With the layout CSS response artificially delayed, hydration has not happened yet, so the
  click is a plain browser navigation and completes normally — no stall either.
