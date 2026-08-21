# Reproduction for vercel/next.js#79307

The reporter's repo (`AshConnolly/cache-bug`) is deleted/private (404), so this is a minimal
re-creation of the described app on Next.js 15.3.2: an `unstable_cache` component
(`revalidate: 5`, 2s artificial delay) and a `fetch(..., { next: { revalidate: 5 } })`
component, each inside `<Suspense>`.

## Run

```bash
npm install

# dev
npm run dev            # http://localhost:3000  and  /unstable-only

# prod
npm run build && npm start
```

Reload `/unstable-only` several times quickly, then wait >5s and reload again.
Server logs print `[unstable_cache MISS]` only when the cached callback actually runs.

## Observed on Next.js 15.3.2 (Node 24)

* dev: `unstable_cache` DOES cache. Rapid reloads print a single `[unstable_cache MISS]`
  and serve the same timestamp in ~30ms (cache survives a dev-server restart via
  `.next/cache`). After 5s the stale value is served and revalidation happens in the
  background — i.e. stale-while-revalidate, not "no caching".
* prod: `/` is prerendered as static with `Revalidate 5s`, so visitors get the previously
  cached HTML instantly (never the Suspense fallback) and the refreshed value only appears
  on a later request. This matches the report; it is ISR stale-while-revalidate.
* There is no supported option in either API to block on revalidation ("skip
  stale-while-revalidate") and render the Suspense fallback instead.
