# Repro: vercel/next.js#56154 — next.config redirect + middleware breaks client-side navigation props

Pages Router. `next.config.js` redirects `/profile` -> `/account`. A **no-op**
`middleware.js` is present.

```
npm install
npm run build
npm start &            # or: PORT=3001 npm start
npm run verify 3000    # playwright check
```

## Observed (next@canary, also 13.5.3)

Clicking the `<Link href="/profile">`:

* `/_next/data/<build>/profile.json` responds **307**
* the catch-all page renders with **`props = {}`** (`NO PROPS`)
* the URL stays `/profile` instead of becoming `/account`

Deleting `middleware.js` (same build otherwise): the data request returns 200 and
the page renders with `{"slug":["profile"],"someVariable":"someValue"}`.

A full page load of `/profile` always redirects correctly to `/account` with props.
