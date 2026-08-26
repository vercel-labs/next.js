# Repro: issue #97940 — Auth-with-Cache-Components guide + Partial Prefetching causes one user lookup per prefetched link

Follows the [Authentication with Cache Components](https://nextjs.org/docs/app/guides/authentication-with-cache-components)
guide: `getCurrentUser()` is a `'use cache: private'` function that reads the session cookie
and does a "database" read (`findUserById` logs each lookup).

`next.config.mjs` sets `cacheComponents: true` and `partialPrefetching: true` (Step 6), and the
home page links to `/notes/[id]` with `<Link prefetch={true}>`.

## Run

```bash
npm install
npm run build
npm start                       # terminal 1, watch stdout
npx playwright install chromium
node test.mjs                   # terminal 2: loads / once with an app_session cookie
```

## Observed (next@16.4.0-canary.8)

Loading `/` **once** logs 7 `findUserById` lookups on the server: 1 for the visited page plus one
per prefetch request for the 5 linked routes (`/notes/1` is fetched twice, once per prefetch level).
With `partialPrefetching: false` the same page load still logs 5 lookups.
