# Repro: next.js#57583 — `not-found` blank with JS disabled when `notFound()` is called from a dynamic route

Repaired/updated fork of https://github.com/ericnishio/not-found-js-disabled-dynamic-route
(the original page used sync `params`, which no longer matches on Next 15+; here `params` is awaited).

## Steps

```
npm install
npm run build && npx next start -p 3002
# and/or: npx next dev -p 3001
```

Then open http://localhost:3002/blog/foo with JavaScript disabled → blank page (HTTP 404).
With JavaScript enabled → "Not Found".
An unmatched route (e.g. /nonexistent-route) renders "Not Found" in the SSR HTML correctly.

Automated check (servers on ports 3001 dev / 3002 prod must be running):

```
npm i -D playwright && npx playwright install chromium && node verify.mjs
```

Observed on next@16.3.1-canary.25 (also on 14.0.1-canary.0 from the original report):
the streamed HTML `<body>` contains no rendered `not-found.tsx` markup, only scripts,
so the page is empty without client JS.
