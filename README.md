# Repro: vercel/next.js#72322 — `window.history.replaceState()` in the first effect is not synced to `useSearchParams()`

## Steps

```bash
npm install
npm run build && npm start   # or: npm run dev
# open http://localhost:3000/?foo=100
```

`app/Bug.js` logs `searchParams` in an effect, and in a second effect calls
`window.history.replaceState(null, '', '?foo=bar')` when `foo >= 5`, then
`router.refresh()` after 1s. The button calls `replaceState` with a random `foo`.

Automated check (Playwright):

```bash
npm i playwright && npx playwright install chromium-headless-shell
node repro-test.mjs http://localhost:3000
```

## Observed (Next 16.3.1 + React 19.2.8, `next start`; same on 15.0.2 dev/start)

Loading `/?foo=100`:

- URL becomes `?foo=bar` (browser history updated)
- `[effect] searchParams:` logs only `foo=100` — `useSearchParams()` never sees `foo=bar`
- 1s later `router.refresh()` restores the URL to `?foo=100`

The same `replaceState` call performed later from the button click *is* picked up
by `useSearchParams()`, so only the first (post-hydration) effect run is affected.

## Expected

`window.history.replaceState()` should be synced with the router regardless of when
it is called, and `router.refresh()` should not revert the URL.
