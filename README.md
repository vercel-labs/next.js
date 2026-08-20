# Repro: middleware redirect is served from the client Router Cache after login (vercel/next.js#59218)

Minimal reproduction of https://github.com/vercel/next.js/issues/59218.

`middleware.js` protects `/dashboard` and redirects unauthenticated users to `/login`.
When a logged-out visitor navigates (or `<Link>` prefetches) `/dashboard`, the client
Router Cache stores the *middleware redirect result* (the `/login` payload) for that href.
After a successful login (cookie set via `/api/login`), the next client-side navigation to
`/dashboard` re-uses that cached entry: the app renders `/login` again and **no request
reaches middleware**, so the user appears stuck at the login page.

## Steps

```bash
npm install
npm run build && npm start   # or: npm run dev
```

1. Open http://localhost:3000
2. Click **Dashboard** -> middleware redirects to `/login` (expected).
3. Click **Click to Login** -> `/api/login` sets `sessionToken=loggedin`, then `router.push('/')`.
4. Click **Dashboard** again -> **`/login` is rendered even though the session cookie exists.**
   A full reload of `/dashboard` renders the protected page correctly.

Automated (needs `npm i -D playwright` and a browser):

```bash
BASE=http://localhost:3000 node repro-test.mjs
```

## Observed (next@16.3.1-canary.25, production build)

```
logged-out -> http://localhost:3000/login
after login -> http://localhost:3000/
client-nav to /dashboard after +0s  -> url=.../login text=Home | Dashboard|LOGIN|Click to Login
client-nav to /dashboard after +15s -> url=.../login text=Home | Dashboard|LOGIN|Click to Login
client-nav to /dashboard after +40s -> url=.../login text=Home | Dashboard|LOGIN|Click to Login
dashboard-related network requests:
  GET http://localhost:3000/dashboard?_rsc=... rsc=true      <-- only one, before login
```

Expected: `/dashboard` renders after login without a manual `router.refresh()` / reload.

Reproduces with a production build on next@14.0.4, next@15.5.7 and next@16.3.1-canary.25
(and in `next dev` on 14.0.4, where dynamic routes also cache the redirect for ~30s).
