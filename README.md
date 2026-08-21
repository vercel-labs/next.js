# Repro: next.js#78493 — redirect() target page server-rendered twice in dev

Issue: https://github.com/vercel/next.js/issues/78493

## Run

```bash
npm install
npm run dev
# open http://localhost:3000 and click "click me"
# watch the dev server terminal
```

`/` links to `/minimum-setup`, whose server component calls `redirect('/minimum-setup/result')`.

## Observed (next dev, `reactStrictMode: true`)

```
Home
 GET / 200
Home
 GET / 200
MinimumSetup
 GET /minimum-setup 200
Minimum Setup Result
 GET /minimum-setup/result 200
Minimum Setup Result
 GET /minimum-setup/result 200   <-- duplicate server render of the redirect target
```

## Expected

`Minimum Setup Result` logged once per navigation.

Setting `reactStrictMode: false` in `next.config.mjs` makes the duplicate disappear.
Verified on next@15.4.0-canary.7 and next@16.3.1-canary.26 (Turbopack dev).
