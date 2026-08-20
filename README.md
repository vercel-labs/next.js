# Repro: next.js#46578 — revalidated page with `notFound: true` keeps serving 200 (pages router, ISR fs cache)

Deterministic version of https://github.com/floreq/200-to-404 (the original relies on wall-clock minute parity).

`/blog/1` is prerendered with `revalidate: 1`. Toggling `/api/flag?on=1` makes `getStaticProps`
return `{ notFound: true, revalidate: 1 }` from then on.

## Run

```bash
npm install
npm run build
npm start           # port 3000, uses next.config.js with cacheMaxMemorySize: 0
curl -sI localhost:3000/blog/1 | head -1        # 200
curl -s  'localhost:3000/api/flag?on=1'         # from now on getStaticProps -> notFound: true
sleep 3; for i in 1 2 3 4 5; do curl -sI localhost:3000/blog/1 | head -1; sleep 2; done
```

Or simply: `npm run repro` (build + start + probe, prints headers).

## Observed (next@16.3.1-canary.25)

With `cacheMaxMemorySize: 0` the page keeps returning `HTTP/1.1 200 OK` forever even though
`getStaticProps` runs on every request and returns `notFound: true`; `.next/server/pages/blog/1.html`
is never updated/removed. Removing `cacheMaxMemorySize: 0` (default in-memory ISR cache) makes the
same app switch to `404` after the first background revalidation.
