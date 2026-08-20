# Repro harness for vercel/next.js#68826 — "Top Suspense fallback not work in chrome or android"

The reporter's CodeSandbox devbox (`priceless-tristan-scjvs6`) is no longer reachable
(HTTP 403), so this is a minimal, machine-verifiable harness for the same scenario:
a single **top-level `<Suspense>`** in the App Router whose fallback should be visible
while the child streams in.

`app/page.js` paints the fallback as a full-viewport **red** box and the resolved child as
a full-viewport **green** box, so "was the fallback actually painted?" is decidable from
compositor frames instead of by eye:

* `RED` frame  -> Suspense fallback was painted
* `GREEN` frame -> resolved content
* `WHITE` frame -> nothing painted yet

`?delay=<ms>` controls how long the suspended child takes (default 3000).

## Setup

```bash
npm install --legacy-peer-deps          # next 15.0.0-canary.112 + react 19.0.0-rc-187dd6a7-20240806 (as reported)
npx playwright install chromium firefox && npx playwright install-deps
```

## Run

```bash
npm run build && npm start              # http://localhost:3000  (next start)
npx next dev -p 3001                    # dev variant

node screencast.mjs                     # CDP screencast of a reload + a fresh navigation
RUNS=3 node sweep.mjs                   # delay sweep 50ms..3s, reports fallback-painted ratio
N=10 node stress.mjs                    # 10 consecutive reloads (reporter's "refresh some times")
node sample.mjs                         # DOM + getComputedStyle + paint timing, chromium AND firefox
URL=https://your-deployment/ node sweep.mjs
```

`variant-next16-cache-components/` is the same page on `next@canary` (16.3.x) with
`experimental.cacheComponents` (PPR) enabled — copy the files into an app root to run it.

## Result observed while triaging (Chromium 151, headless=new)

Every configuration painted the fallback ~25-110ms after navigation and kept it until the
child resolved, i.e. the report could not be reproduced:

```
delay=50ms   fallback painted in 3/3 loads | [WHITE@20 RED@55 GREEN@95] ...
delay=3000ms fallback painted in 3/3 loads | [WHITE@9 RED@27 GREEN@3016] ...
```

Tested: `next start` and `next dev` on 15.0.0-canary.112, PPR/cacheComponents on
16.3.1-canary.25 locally and deployed on Vercel, with and without 300ms/400kbps +4x CPU
throttling and an Android Chrome UA, over 10 consecutive reloads. Firefox behaved the same.
