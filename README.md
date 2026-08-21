# Repro: `searchParams` empty on statically generated page in Draft Mode (Vercel deployments)

Upstream issue: https://github.com/vercel/next.js/issues/92562

Mirrors https://github.com/illiakovalenko/app-router-draft-mode-proxy-bug with `next` pinned to `16.2.1-canary.29`.

## Steps

1. `npm install`
2. Deploy this directory to Vercel (`vercel --prod`) — the bug only appears on Vercel, not with `next build && next start`.
3. Open `<host>/api/render`. The route handler enables Draft Mode and redirects to `/test?language=en&timestamp=...`.

## Observed (deployed to Vercel, next@16.2.1-canary.29)

`Draft mode is enabled` / `Search params: {}` — the query string is lost.
Response headers contain `x-nextjs-prerender: 1` and `x-vercel-cache: BYPASS`.

## Expected

`Search params: {"language":"en","timestamp":"..."}` (what `next start` returns locally).

## Notes

- Removing `generateStaticParams` from `app/[[...path]]/page.tsx` makes searchParams arrive
  correctly on Vercel (the route is then served as a dynamic function, no `x-nextjs-prerender` header).
- Reproduces on Vercel with next@15.3.9 and next@15.5.23 as well.
