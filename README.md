# Repro: Missing prefetch headers in Middleware (vercel/next.js#63728)

Reproduced on **next@16.3.1** (Node 24), `next build` + `next start`.

## Run

```bash
npm install
npm run build
npm start            # terminal shows the [middleware] logs

# in another shell: a full/RSC prefetch request
curl -s -o /dev/null "http://localhost:3000/a?_rsc=x" -H 'RSC: 1'

# or drive a real browser (prefetch={true} link in app/layout.tsx)
npm i -D playwright && npx playwright install chromium
node check-prefetch.mjs
```

## What happens

* `middleware.ts` logs every request it sees plus the prefetch-related headers.
* Loading `/` in a browser triggers prefetches for `/a` and `/b`.
  Requests that carry `Next-Router-Prefetch: 1` are correctly skipped by the
  `missing` matcher, but the *full* prefetch issued by `<Link prefetch={true}>`
  is an `RSC: 1` request **without** `Next-Router-Prefetch`, so middleware runs
  for it.
* Inside middleware every flight header is `null` (`rsc`, `next-router-prefetch`,
  `next-router-state-tree`, `purpose`), even when the client sent them:
  `src/server/web/adapter.ts` deletes `FLIGHT_HEADERS` before invoking
  middleware, so there is no way to detect a prefetch from within middleware.

Server log excerpt:

```
[middleware] {"path":"/","rsc":null,"next-router-prefetch":null,...}
[middleware] {"path":"/a","rsc":null,"next-router-prefetch":null,...}   <- prefetch request
```
