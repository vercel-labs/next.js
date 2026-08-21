# Repro: vercel/next.js#84942

`useRouter().push({ query })` (query-only navigation) on a **mid-path** dynamic route
(`pages/[id]/detail.js`) stops updating the dynamic segment and appends the param as a query.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
# then, in another shell:
npm i -D playwright && npx playwright install chromium && node repro.mjs
```

Or manually: open `/a/detail` -> click "push to [b] page" -> click "push to [c] page".

| step | actual (next >= 15.5.0, incl. 16.3.1-canary.26) | expected (next 15.4.6) |
| --- | --- | --- |
| push to [b] | `/b/detail?fromId=a` | `/b/detail?fromId=a` |
| push to [c] | `/b/detail?id=c&fromId=b` | `/c/detail?fromId=b` |

## Cause

`resolveHref` (changed in #82236) matches `router.asPath` against `getRouteRegex(router.pathname)`
without stripping the query string, so for `/[id]/detail` the match fails
(`getRouteMatcher(getRouteRegex('/[id]/detail'))('/b/detail?fromId=a') === false`)
and the base falls back to `router.asPath`, freezing the resolved pathname.
Routes with a trailing dynamic segment (`/[id]`) accidentally still "match"
(`id === 'b?fromId=a'`), which is why they are unaffected.
