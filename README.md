# Repro: i18n (pages i18n config) + App Router — `/?_rsc=` returns 404 on Vercel, causing hard reload

Issue: https://github.com/vercel/next.js/issues/57741

Only `next.config.js` `i18n` + App Router. No `pages/` dir.

## Reproduce
1. `npm install && npx vercel deploy --prod` (or import this dir into Vercel).
2. Open `/test` on the deployment, click the "Home" link.
3. Network tab: `GET /?_rsc=...` -> **404** (`x-vercel-error: NOT_FOUND`), and the router falls back to a full document load (hard reload).

`GET /test?_rsc=...` returns 200. `GET /?_rsc=...` and `GET /en?_rsc=...` return 404.

## Not reproducible locally
`next build && next start` -> `curl -H 'RSC: 1' 'http://localhost:3000/?_rsc=abc'` -> 200.
`.next/server/app/index.rsc` exists in the build output.

Verified with next@15.5.7 (also reproduces on the reporter's next@13.5.6 deployment).
Note: with next@16.3.1-canary.25 this config fails to build entirely:
`Error [PageNotFoundError]: Cannot find module for page: /_document` while prerendering `/en/404`.
