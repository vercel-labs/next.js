# Repro: vercel/next.js#72541 — parallel intercepted routes break when navigated from a 404 page

The reporter's repo (`itsjavi/nextjs-demos`) is no longer public, so this is a minimal re-creation.

## Files
- `app/layout.js` — root layout with a `@modal` slot and a `<Link href="/photo/1">`
- `app/@modal/(.)photo/[id]/page.js` — intercepting route (modal)
- `app/photo/[id]/page.js` — the "real" page
- `app/@modal/default.js`, `app/default.js`, `app/error.js`

## Steps
```bash
npm install
npm run dev
# open http://localhost:3000/nonexistent  (renders the built-in 404)
# click "Open photo 1 (intercepted modal)"
```

Automated: `node repro-test.js dev` (requires `npm i playwright && npx playwright install chromium`).

## Observed
- next@15.5.4 (`next dev` and `next start`): client-side crash
  `TypeError: initialTree is not iterable` (minified in prod: `e is not iterable`),
  UI shows "Application error: a client-side exception has occurred".
- next@16.3.1 (latest stable): no crash, but the URL changes to `/photo/1` while the
  404 content stays on screen — nothing renders (neither modal nor page).
- next@16.3.1-canary.25: no crash; navigates to the full `/photo/1` page, i.e. the
  interception is still not applied when starting from a 404 page.
- Baseline in every version: clicking the same link from `/` correctly renders the
  intercepted modal.
