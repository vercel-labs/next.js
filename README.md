# Repro: `Failed to execute 'measure' on 'Performance': '​X' cannot have a negative time stamp` (vercel/next.js#86060)

Deterministic reproduction of the intermittent dev-only runtime `TypeError` reported in
https://github.com/vercel/next.js/issues/86060.

## Root cause found while reproducing

The RSC client stores `response._timeOrigin = serverTimeOriginEpochMs - performance.timeOrigin`
(`node_modules/next/dist/compiled/react-server-dom-turbopack/cjs/react-server-dom-turbopack-client.browser.development.js`).
When the rendering server's clock is behind the browser's `performance.timeOrigin`
(WSL2 / VM / container clock skew, or a response produced before the current document's navigation start),
all server component debug times become **negative**.

`flushComponentPerformance` guards the normal path with `0 <= childrenEndTime`, but the
**errored/rejected row** path (`"rejected" === root.status && root.reason !== response._closedReason`)
calls `performance.measure(..., { start: 0 > startTime ? 0 : startTime, end: childrenEndTime })`
with no guard on `end`, so a negative `end` throws. `notFound()` rejects the row, which is why the
error names the page that called `notFound()` (`SlugPage`, `NotFound`, `AdminPage [Prerender]`, ...).

## Run

```bash
npm install
# emulate the clock skew (server 10s behind the browser); requires `faketime`
faketime -f -10 npx next dev
node check.mjs http://localhost:3000/trigger-not-found   # -> REPRODUCED
node check.mjs http://localhost:3000/hello               # -> clean (no notFound())
```

`check.mjs` launches Playwright Chromium and fails only on the negative-timestamp error.

Observed with next@16.3.1: `/trigger-not-found` throws
`Failed to execute 'measure' on 'Performance': '\u200bSlugPage' cannot have a negative time stamp.`
on **both** `next dev` (Turbopack) and `next dev --webpack`; routes without `notFound()` are clean.
Without the clock skew nothing throws, which explains the reported randomness.
