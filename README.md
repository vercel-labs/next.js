# Reproduction — next.js#98046

Middleware redirect issued for a client-side RSC soft navigation.

- `middleware.js` redirects `/target` -> `/start` (redirect-to-self) by default.
  Build with `NEXT_PUBLIC_REDIRECT_TARGET=/denied` to test the "different route" case.
- `experimental.validateRSCRequestHeaders` is driven by `VALIDATE_RSC=true|false`.
- `/start` is `force-dynamic` and prints the `mode` cookie + a render timestamp,
  so you can see whether the router applied a fresh render.

## Run (Case 3 — redirect-to-self, broken with the flag either way)

```bash
npm install
VALIDATE_RSC=true npx next build && VALIDATE_RSC=true npx next start
# in another shell (needs `npm i playwright && npx playwright install chromium`)
node check.js case3
```

Repeat with `VALIDATE_RSC=false` — same failure.

Observed: after clicking "Go to /target" (cookie `mode=B` was just set), the RSC
request is redirected by middleware back to `/start`, a fresh `text/x-component`
payload is fetched, but the DOM keeps the stale pre-navigation render
(`mode=none`, unchanged timestamp). A hard reload shows `mode=B`.

Control (`node control.js`): `router.push('/start')` without the middleware
redirect DOES apply the fresh render (`mode=B`, new timestamp).

## Case 1 (different route + validateRSCRequestHeaders: true)

```bash
NEXT_PUBLIC_REDIRECT_TARGET=/denied VALIDATE_RSC=true npx next build
VALIDATE_RSC=true npx next start
node check.js case1
```

Not reproducible on next@16.3.3 (prod or dev): URL becomes `/denied` and
`/denied` renders as expected.
