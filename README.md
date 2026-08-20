# Repro harness for vercel/next.js#69064 — `revalidateTag()` inside a dynamic route handler

The reporter's app (younes101020/electra-v2) needs Docker + private TMDB API keys, so it is
not runnable as-is. This is a minimal harness for the described flow:

* `POST /api/rate/[accountid]` (dynamic route handler) calls `revalidateTag('rated:<id>')`.
* `GET /api/rated/[accountid]` reads an `unstable_cache()` entry tagged `rated:<id>`.
* `/rated-dynamic` renders the same `unstable_cache()` entry from a Server Component.
* `/usecache` is the modern control (`'use cache'` + `cacheTag`).

```bash
npm install
npm run build
npm start &            # next start -p 3000
node stress.mjs 30     # read -> revalidateTag -> read immediately, 30x
node check.mjs         # page-level check
```

## Result: not reproduced

Next.js 16.3.1 / Node 24:

```
stale (not revalidated on the very next request): 0/30
/rated-dynamic: revalidated=true
/usecache:      revalidated=true
```

The same harness on the reported version (next@14.2.3, `next dev` and `next start`)
also revalidated on every iteration (0 stale in 15–20 iterations, route handler,
Server Component page, and a Playwright `router.refresh()` flow).

Note: while building this we hit the most likely explanation for the report — a tag
mismatch. In Next 15/16 `params` is a Promise, and using `params.accountid` without
`await` produces the tag `rated:undefined`, so the cache entry tagged `rated:42`
is never invalidated and looks like a "flaky" `revalidateTag`. Awaiting `params`
fixes it. The only real staleness we could observe is the client Router Cache /
async `router.refresh()` round trip: reading the DOM before the refresh RSC
response lands shows the old value.
