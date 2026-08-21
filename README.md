# Reproduction: next/link navigation serves a stale RSC payload after a rebuild (#75228)

Minimal, automated reproduction of https://github.com/vercel/next.js/issues/75228.

```bash
npm install
npx playwright install chromium
npm run repro
```

`repro.mjs` builds + starts the app (`/test` renders `MARKER_V1`), soft-navigates to `/test`
in a persistent Chromium profile, then changes `/test` to `MARKER_V2`, rebuilds, restarts and
re-opens the *same* profile (so the browser HTTP cache survives, like a real user session).

Why: `next start` serves RSC payloads for static App Router routes with
`Cache-Control: s-maxage=15, stale-while-revalidate=31535985` (default `expireTime`),
so the browser reuses the payload produced by the *previous build* for up to a year.

Observed on next@15.1.6: the second session renders `MARKER_V1` while the server already
serves `MARKER_V2`, and/or the router logs "Failed to fetch RSC payload" and falls back to a
full document request (hard navigation).

Workaround from the issue thread: `expireTime: 0` in `next.config`, or sending
`Cache-Control: public, max-age=0, must-revalidate`.

Also reproduces on `next@16.3.1-canary.26` (same `s-maxage=15, stale-while-revalidate=31535985`
response, `fromDiskCache=true`, hard navigation).

Sample output of the second session:

```
[rsc] 200 http://localhost:3000/test?_rsc=rxx9e fromDiskCache=true cache-control="s-maxage=15, stale-while-revalidate=31535985"
[rsc] 200 http://localhost:3000/test?_rsc=rxx9e fromDiskCache=false ...
== build 2 (same browser profile => same HTTP cache) ==
  server HTML marker      : MARKER_V2
  browser rendered marker : MARKER_V2
  full document requests during click: http://localhost:3000/test   <-- hard navigation
```

In a larger app (the original report) the stale cached payload is also *rendered*, i.e. the
route keeps showing pre-rebuild content until a hard reload.
