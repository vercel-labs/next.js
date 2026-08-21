# Repro: `fetch` `next: { revalidate }` — stale-while-revalidate vs. blocking

Reproduction for https://github.com/vercel/next.js/issues/75641 (docs say
stale-while-revalidate on the Caching page, but the `fetch` API reference says
"cache lifetime of at most n seconds").

## Setup

- `origin-server.mjs` — upstream data source on port 4000. It returns an
  incrementing counter and **sleeps 1s** on purpose, so a blocking revalidation
  is visible as ~1s response latency.
- `app/api/data/route.js` — `force-dynamic` route (no full route cache) doing
  `fetch('http://127.0.0.1:4000/', { next: { revalidate: 5 } })`. It reports the
  upstream value plus how long the `fetch()` call itself took (`fetchMs`).
- `probe.mjs` — hits the route once per second for 20s and prints client latency,
  the served upstream value and `routeFetchMs`.

## Run

```bash
npm install
node origin-server.mjs &        # upstream on :4000
npm run build && npm start &    # Next.js on :3000
node probe.mjs
```

## Observed

Next.js 16.3.1 — true stale-while-revalidate: every response is fast (~6ms),
stale value is served past the 5s window and updates a beat later:

```
t= 2s  clientMs=   8  upstreamValue=11  routeFetchMs=   0
t= 3s  clientMs=   6  upstreamValue=12  routeFetchMs=   1
t=10s  clientMs=   6  upstreamValue=13  routeFetchMs=   1
t=11s  clientMs=   5  upstreamValue=14  routeFetchMs=   1
```

Next.js 15.1.7 (`npm i next@15.1.7 react@19.0.0 react-dom@19.0.0`) — stale data
is still served, but the first request after expiry is held ~1s while the
revalidation runs, even though the cache read (`routeFetchMs`) is instant:

```
t= 5s  clientMs=   4  upstreamValue=7  routeFetchMs=   0
t= 6s  clientMs=1007  upstreamValue=7  routeFetchMs=   1   <-- stale, but blocked 1s
t= 7s  clientMs=   4  upstreamValue=8  routeFetchMs=   0
```

So neither version implements "cache lifetime of at most n seconds" (stale data
is served after the window), and on 15.x the SWR promise of an immediate
response does not hold.
