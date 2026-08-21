# Repro: `router.replace(..., { shallow: true })` flag persists in history state (vercel/next.js#93844)

Reporter's linked repo (`JanKaifer/next-repro-34365`) is **empty**, so this is a minimal standalone repro.

## Run

```bash
npm install
npx playwright install chromium
npm run build && npm start   # or: npm run dev
npm test
```

## Tests

- `tests/same-route.spec.js` — **FAILS** (bug): same-route history entry that was created by a
  shallow `router.replace` is restored on browser back without re-running `getServerSideProps`.
  Steps: load `/page1` → `replace('/page1?count=1', { shallow: true })` →
  `push('/page1?count=2')` (real fetch) → `replace('/page1?count=3', { shallow: true })` → browser back.
  The URL becomes `/page1?count=1` but props are still the ones fetched for `count=2`
  and zero `/_next/data` requests are made.
- `tests/shallow-back.spec.js` — PASSES: the exact table in the issue (back across *different*
  routes `/page2` → `/page1`) does refetch, because `router.js` only honours shallow when
  `nextState.route === route`.

`pages/page1.js` prints the `getServerSideProps` stamp in `#stamp`; the server also logs `[GSSP]`.
