# Repro: issue #65787 — `Rsc` header and `_rsc` query param are stripped before middleware

## Run

```bash
npm install
npm run dev
# then in another shell:
curl -H "RSC: 1" -H "Next-Router-Prefetch: 1" "http://localhost:3000/page2?test=1&_rsc=1dou9"
```

Or open http://localhost:3000 in a browser and click the "Page2?test=1" link
(the client sends `?_rsc=...` plus `Rsc: 1`).

## Observed (next@16.3.1-canary.25, Node 24)

Middleware log for the RSC navigation request:

```
[middleware] url: http://localhost:3000/page2?test=1
[middleware] test param: 1
[middleware] _rsc param: null
[middleware] rsc header: null
[middleware] next-router-prefetch header: null
```

The `_rsc` query param, the `Rsc` header, `Next-Router-Prefetch` and
`Next-Router-State-Tree` are all removed from the request seen by middleware,
so middleware cannot distinguish RSC/prefetch requests from document requests
(needed for CDN cache keys, auth rate limiting, logging).
