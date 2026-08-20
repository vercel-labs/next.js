# Repro: next.js#65283 — "Next.js caches GraphQL API requests using fetch"

Minimal reproduction of the reported symptom: a server component POSTs to a GraphQL
endpoint with `cache: 'no-store'`, yet the user sees stale data.

## What it actually shows

* The `fetch` itself is **not** cached: every fresh request / reload hits the upstream
  (`upstream hits` increments on reload in both dev and `next start`).
* The stale data comes from the **client-side Router Cache**: with Next 14.1.3, client
  navigations back to a dynamic page reuse the RSC payload for 30s, so the
  `no-store` fetch is never re-executed.
* On Next 15 (default `staleTimes.dynamic = 0`) every client navigation re-renders and
  the upstream is hit again.

## Run

```bash
npm install
node graphql-server.mjs &      # fake GraphQL upstream on :4000, returns an incrementing counter
npm run build && npm start     # http://localhost:3000
node test-router-cache.mjs     # playwright: load -> /other -> / x3 -> hard reload
```

### Observed (next 14.1.3, `next start`)

```
1-first-load:        upstream hits: 26
2-after-client-nav:  upstream hits: 26
3-after-client-nav:  upstream hits: 26
4-after-client-nav:  upstream hits: 26
5-hard-reload:       upstream hits: 27
```

After 35s the client cache entry expires and the next navigation hits the upstream again.

### Observed (next 15.5.4)

```
1-first-load:        upstream hits: 21
2-after-client-nav:  upstream hits: 22
3-after-client-nav:  upstream hits: 23
4-after-client-nav:  upstream hits: 24
5-hard-reload:       upstream hits: 25
```
