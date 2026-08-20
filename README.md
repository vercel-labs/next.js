# Reproduction attempt: vercel/next.js#67647

`DYNAMIC_SERVER_USAGE` logged when a Server Action redirects to a route that uses `cookies()`
while middleware matches that route.

Derived from the reporter's repo (https://github.com/joncoronel/supabase-testing, commit
`3169e6995402cd1dd7b64369d411badcfc9bef3e`). The original pins `next@15.0.0-canary.63`, which
Vercel now refuses to deploy ("Vulnerable version of Next.js detected"), so the reporter's
"deploy to Vercel" steps cannot be followed as-is. This copy only bumps Next/React and awaits
`cookies()` (Next 15+ async API); the app structure (server action `redirect()`, pass-through
middleware matching all routes, `cookies()` at the route root and inside a `Suspense`
boundary) is unchanged.

## Run

```bash
npm install
npm run build
npm start          # then click the two "through server action" buttons on /
```

or deploy the folder to Vercel and click the same buttons.

## Result of this attempt

No error was observed:

- `next@16.3.1-canary.25` on Vercel: server action returns the destination flight
  (`x-action-redirect: /private;push`, `x-nextjs-prerender: 1`), page renders, no error digest
  in the payload, no 500.
- `next@15.5.23` and `next@14.2.35` on Vercel: action POST returns 303, redirect completes,
  destination renders.
- `next@15.0.0-canary.63` (reporter's exact version) and `next@14.2.35` with local
  `next build && next start`: no `DYNAMIC_SERVER_USAGE` in server output.

The originally reported error is only visible in Vercel platform logs, which were not
accessible in this environment; an in-app `onRequestError` collector was not usable because
each route runs in its own function instance (verified with a deliberately throwing route).
