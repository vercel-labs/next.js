# Repro: React `cache()` does not dedupe in middleware (next.js#48169)

Steps:
1. `npm install`
2. `npm run dev` (or `npm run build && npm start`)
3. `curl -D- -o /dev/null http://localhost:3000/`

Expected: the `cache()`-wrapped function runs once per request; response header `x-cached-fn-executions: 1`.
Actual: it runs twice per request (`x-cached-fn-executions: 2`), and `fetch` with `next: { revalidate }` is not cached
(no `x-nextjs-cache` header, request re-issued).

Verified on next@16.3.1-canary.25 in both dev (Turbopack) and `next build`/`next start`.
