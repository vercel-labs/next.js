# Repro: issue #81198 — parallel routes: back navigation shows no cached page and no loading state

Minimal reproduction of https://github.com/vercel/next.js/issues/81198 (parallel routes).

## Run

```
npm install
npm run dev
# open http://localhost:3000/dashboard
```

1. `/dashboard` renders `children` + `@revenue` + `@users` slots (each `await sleep(3000)`, each has `loading.js`).
2. Click **View Archived Revenue Data** -> `/dashboard/revenue/archived` (1.5s delay).
3. Click **Back to Dashboard**.

## Observed (next 15.3.4 and 15.5.23, `next dev`)

The URL stays on `/dashboard/revenue/archived` and the archived content stays on screen
for the full ~3s of server work. No `loading.js` for any slot, no cached dashboard.
Only after the data resolves does the URL flip to `/dashboard` and content appear.

## Expected / next@canary (16.3.1-canary.26)

Navigation is instant: URL updates immediately, `loading.js` for `children` shows right away,
and the `@revenue` / `@users` slots keep their previously cached content.
