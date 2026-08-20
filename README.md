# Repro: next#73845 — `revalidate` fetches always logged as `cache hit`

Minimal reproduction of https://github.com/vercel/next.js/issues/73845.

`app/fetch-cache/page.tsx` calls the same URL 4x with
`{ cache: 'force-cache', next: { revalidate: 1 } }`. The target is a local
`force-dynamic` route handler that increments a counter and logs each origin hit.

## Run

```bash
npm install
npm run dev   # port 3001
# then, repeatedly, waiting > 1s between requests:
curl -s http://localhost:3001/fetch-cache | grep -o '"counter": [0-9]*'
```

## Observed (next@15.1.1-canary.1 and next@16.3.1-canary.25)

After the first render, every subsequent request logs `(cache hit)` for all four
fetches, including the first — never `stale`/`miss`/`revalidating` — yet the server
log shows `[origin] /api/time hit #N` for each request, so the entry *is* being
revalidated in the background (stale-while-revalidate). Rendered values increase by
one per request, i.e. the page renders the previous (stale) payload.

So the cache *is* revalidated; the `next dev` fetch log is inaccurate for a stale
entry that triggers background revalidation, which is what makes it look like
`revalidate` is ignored.
