# `redirect()` into an intercepted parallel route -> infinite reload loop

Minimal reproduction for https://github.com/vercel/next.js/issues/67522

`app/@modal` has `(.)login` (intercepting), `[...catchAll]` and `default.tsx`.
`app/page.tsx` calls `redirect('/login')`.

## Run

```bash
npm install --legacy-peer-deps
npm run dev
```

1. Open http://localhost:3000/start
2. Click "Go to / (redirects to /login)" (a client-side navigation to `/`)

## Observed (next@15.0.0-rc.0)

The router never settles: the browser loops on `/login` and the dev server logs
hundreds of `GET /login 200` lines per second (~1700 in 20s measured with
Playwright, ~950 main-frame navigations). The modal content is rendered but the
page keeps reloading.

A hard load of `http://localhost:3000/` (no client-side navigation) redirects to
`/login` once and does not loop.

## Note

With `next@16.3.1-canary.25` the loop is gone (6 `GET /login` total), but the
client-side redirect lands on the full `/login` page instead of the intercepted
`@modal/(.)login` route.
