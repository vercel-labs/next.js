# Repro: middleware/proxy does not run when navigating to a cached (prefetched) static route

Issue: https://github.com/vercel/next.js/issues/54001
(The reporter's repo https://github.com/mgoodenough/nextjs-middleware-caching now 404s, so this is a fresh minimal repro.)

## Setup
`middleware.ts` logs `MIDDLEWARE_RUN pathname => ...` for `/`, `/dashboard` (static) and `/dynamic` (dynamic, reads cookies).
The layout has `<Link>`s between all three pages.

## Run
```bash
npm install
npm run build && npm run start   # http://localhost:3001
node repro.mjs                   # Playwright: Home -> Dashboard -> Home -> Dashboard -> Home
```
Watch the server console for `MIDDLEWARE_RUN` lines.

## Observed (next@16.3.1-canary.25, production)
Playwright reports **zero network requests** for every `<Link>` navigation between the static
routes, and the server logs middleware only for the initial document + the two prefetches:

```
MIDDLEWARE_RUN pathname => /          <- document
MIDDLEWARE_RUN pathname => /          <- prefetch
MIDDLEWARE_RUN pathname => /dashboard <- prefetch
...no further runs for the 4 client navigations...
```

`node repro2.mjs` shows the dynamic route (`/dynamic`) DOES issue an `?_rsc=` request and runs
middleware on every navigation, so the gap is specific to prefetched/cached static routes.

## Expected
Per the docs ("Middleware runs before cached content and routes are matched"), middleware should
run before a cached client-side navigation is served, e.g. for auth gating.
