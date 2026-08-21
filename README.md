# Repro: pages router shallow push + middleware/proxy rewrite renders the previous route

Issue: https://github.com/vercel/next.js/issues/86261

## Run

```
npm install
npm run dev   # or: npm run build && npm start
```

Open http://localhost:3001, click "go to /some-route", then click
"push shallow (buggy: query only)" twice.

## Setup

- `middleware.js` rewrites every request to `/<device>/<path>` (device derived from the UA),
  so pages live under `pages/[device]/`. The rewritten segment is never visible in the URL bar.
- `/some-route` does `router.push({ query: { ...router.query, n } }, undefined, { shallow: true })`.

## Observed (next@16.0.3, dev + next start)

- After client-side nav: `pathname=/[device]/some-route`, `asPath=/some-route`, `query={device:'desktop'}`.
- 1st shallow push: URL becomes `/some-route?device=desktop&n=1`, but router state degrades to
  `pathname=/[device]`, `query={device:'some-route', n:'1'}`.
- 2nd shallow push: the **home** page (`pages/[device]/index.js`) renders while the address bar
  still shows `/some-route?n=2`.

On next@15.4.0 the same clicks keep rendering `/some-route` (the internal `/desktop/...` path leaks
into the URL instead), i.e. the "previous route renders" behavior is a regression after 15.4.
