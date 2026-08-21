# Repro: force-dynamic page served from the client router cache after a cookie-setting server action

Upstream issue: https://github.com/vercel/next.js/issues/83034

The reporter's CodeSandbox devbox is not publicly downloadable, so this is a minimal
standalone reproduction of the same scenario.

## Setup

- `app/layout.tsx` renders a client component that calls a server action in `useEffect`
  (the "session refresh in the layout" pattern). The action writes a cookie.
- `/` and `/test` are both `export const dynamic = 'force-dynamic'` and print
  `Date.now()` plus the cookie value.
- Navigation uses `next/link`.

`NEXT_PUBLIC_ACTION_MODE` controls the action (build-time):
`set` (default, cookie written -> bug), `noset` (action runs, no cookie), `none` (no action).

## Run

```bash
npm install
npx playwright install chromium
npm run build
npm start        # production server on :3000
node test.mjs    # drives / -> /test -> / five times
```

## Expected vs actual (next 15.5.0 / 15.5.23, `next start`)

The second visit to `/` prints the exact same `rendered-at` timestamp as the first
page load, i.e. the `force-dynamic` page is served from the client router cache and the
server is never asked to re-render. From the third visit on, every navigation re-renders.

```
initial /        | cookie: layout-1787278559343 | rendered-at: 1787278559348
1: /test         | cookie: layout-1787278559343 | rendered-at: 1787278560132
1: /             | cookie: layout-1787278559343 | rendered-at: 1787278559348   <-- stale
2: /             | cookie: layout-1787278559343 | rendered-at: 1787278562489   <-- fresh
```

Controls (same app):
- `NEXT_PUBLIC_ACTION_MODE=noset` or `none`: every visit re-renders -> the cookie write in
  the server action is the trigger.
- `next dev`: every visit re-renders.
- `next@16.3.1-canary.26` production build: every visit re-renders (no longer reproducible).
