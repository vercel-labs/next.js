# Repro: vercel/next.js#73382 — `Cache-Control` missing on responses served from a shared cache handler

Two Next.js production server **processes** (standing in for two containers / pods behind a
load balancer) share one cache store through a custom `cacheHandler`. The process that did
**not** render the page serves the cached HTML **without any `Cache-Control` header**, so a
CDN (Azure Front Door in the original report) caches it forever.

## Run

```bash
./repro.sh
```

(`npm install && npm run build`, starts server A on :3001 and B on :3002 sharing
`./.shared-cache`, then prints response headers.)

## Actual output (Next.js 16.3.1)

```
=== 1. server A renders /isr/foo (cache MISS -> writes shared cache) ===
HTTP/1.1 200 OK
x-nextjs-cache: MISS
Cache-Control: s-maxage=60, stale-while-revalidate=31535940

=== 2. server A serves it again ===
HTTP/1.1 200 OK
x-nextjs-cache: HIT
Cache-Control: s-maxage=60, stale-while-revalidate=31535940

=== 3. server B serves the SAME entry from the shared cache (BUG) ===
HTTP/1.1 200 OK
x-nextjs-cache: HIT

=== 4. server B again ===
HTTP/1.1 200 OK
x-nextjs-cache: HIT
```

Expected: every cache hit carries `Cache-Control: s-maxage=60, ...` (from `export const revalidate = 60`).

## Why

`SharedCacheControls` (`next/dist/server/lib/incremental-cache/shared-cache-controls.external.js`)
keeps route cache-control values in a **per-process static `Map`**, written only by the process
that rendered/`set()` the entry. The fallback source is the prerender manifest, and for this route
(`generateStaticParams()` returns `[]`) `dynamicRoutes['/isr/[slug]']` has no `fallbackRevalidate`.
So on any other process `get()` returns `undefined` → no `Cache-Control` header is emitted, even
though the cache entry itself was found. The custom cache handler never receives or returns the
cache-control/revalidate value, so it cannot be shared between processes.

This matches the analysis in the issue comments (in-memory revalidate timings, missing on other
containers) and explains the "random, mainly just after a deployment" nature of the report: the
container that serves a request is often not the one that populated the shared cache.
