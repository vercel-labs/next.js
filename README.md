# Repro: next.js#10465 — stale previous page rendered during history back/forward to a `getInitialProps` page

Pages Router. `/` is static, `/data` has `getInitialProps` with a 1s delay.

## Run
```
npm install
npm run build && npm run start   # http://localhost:3000
# optional automated probe (needs playwright chromium installed)
node probe.mjs
```

## Steps
1. Open `/`, click the link to `/data`.
2. Go back (browser back / iOS swipe-back).
3. Go forward (browser forward / iOS swipe-forward).

## Observed
After the popstate the URL is already `/data`, but the router keeps rendering the
**previous** page (`index`) for the whole ~1000ms `getInitialProps` duration before
`/data` appears. `probe.mjs` samples the DOM every 50ms and prints
`url=/data h="index"` for ~1s, then `url=/data h="Test mobile back"`.

On iOS WebKit this stale frame is what users see as the "flash of the previous page"
after the swipe snapshot is dropped.
