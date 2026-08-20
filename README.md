# Repro: next.js#10900 — getInitialProps not re-called when `href` query changes and both `href`/`as` contain a hash

Reproduced on Next.js 16.3.1 (pages router, `next dev`).

## Run

```bash
npm install
npm run dev            # http://localhost:3000
# in another shell (needs playwright + chromium):
npm i playwright && npx playwright install chromium
node verify.mjs
```

Or manually open http://localhost:3000 and click each button 3 times.

## Expected vs actual

- "replace without hash" (`Router.replace('/?test=N', '/')`): `getInitialProps` runs on every click, `test: N` increments.
- "replace with hash" (`Router.replace('/?test=N#hash', '/#hash')`): `getInitialProps` is never re-called, `test: undefined` forever.

`verify.mjs` output:

```
=== #no-hash ===  click 1..3 -> test: 1 / 2 / 3, client getInitialProps calls ['1','2','3']
=== #with-hash === click 1..3 -> test: undefined,  client getInitialProps calls []
```

## Cause

`Router.onlyAHashChange(as)` (shared/lib/router/router.ts) compares only the `as` path/hash.
Since `as` differs from the previous one only by the hash, the navigation is short-circuited as a
hash change (`hashChangeStart`/`hashChangeComplete`) and the changed query in `href` is ignored,
so no data fetch / `getInitialProps` happens.
