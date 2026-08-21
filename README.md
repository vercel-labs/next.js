# Repro: vercel/next.js#76954 — delay before Suspense fallback on search-param navigation

Stock `next/navigation` hooks (no nuqs). Clicking a filter calls `router.push('?filter=b')`.
The page keeps showing **stale data** and the `Suspense` fallback only appears once the new RSC
payload starts arriving, i.e. after the full server round trip for the page shell.

## Run

```bash
npm install
npm run build && npm start          # or: npm run dev
node measure.js http://localhost:3000   # Playwright timings (click -> fallback -> data)
node stale-check.js                     # prints the DOM during the stale window
```

Routes:
- `/` — fast shell, slow (3s) card inside `Suspense`
- `/slow-shell` — page shell awaits 1500 ms before rendering (typical dashboard with dynamic page-level work)
- `/loading-file` — same as `/slow-shell` but with a route-level `loading.js`

## Measured (ms after click, Playwright + CDP throttling)

next 15.2.0 (prod `next start`):

| route | throttle | fallback shown | new data |
|---|---|---|---|
| `/` | none | 24 | 3014 |
| `/` | 400 ms RTT | 441 | 3010 |
| `/slow-shell` | none | 1512 | 4511 |
| `/slow-shell` | 400 ms RTT | 1515 | 4514 |
| `/loading-file` | none | 1524 | 4527 |

next 16.3.1-canary.26 + react 19.2: same numbers (`/slow-shell` fallback at ~1520 ms).

At 800 ms after the click on `/slow-shell`, `location.search` is still `?filter=a` and the DOM
still shows `card data for a` — no loading indicator at all. A route-level `loading.js` does not
appear any earlier.
