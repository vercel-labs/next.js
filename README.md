# Repro: Intercepting routes trigger when pushing to the route you are already on (#82934)

Routes:
- `app/(auth)/signin/page.jsx` — full sign-in page (has a button calling `router.push("/signin", { scroll: false })`)
- `app/@authModal/(.)signin/page.jsx` — intercepted modal slot

## Run

```bash
npm install
npm run dev            # webpack dev server on :3000
node test.mjs          # Playwright check (needs `npx playwright install chromium`)
```

## Observed (next dev, 15.4.7 and 16.0.0)

1. `/` → click link to `/signin` → modal renders (expected).
2. Hard-load `/signin` → full page renders, no modal (expected).
3. On `/signin`, click "push /signin again" → the intercepted modal is rendered **on top of the full page** (`#modal` and `#full-page` both present) — unexpected.

## Not affected

- `next build && next start` (15.4.7): step 3 renders no modal.
- `next@16.3.1-canary.26` dev (webpack and Turbopack): step 3 renders no modal.
