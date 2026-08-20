# Repro: vercel/next.js#69401 — stale segment after fast reload + browser Back

App Router app with `/page1` and `/page2`. If the browser Back button is pressed while a
full page reload is still loading the client bundle, the URL updates to the previous route
but the rendered segment stays the one from the reloaded route.

## Run

```bash
npm install
npx playwright install chromium
npm run build
npm start                 # next start on http://localhost:3001
BASE_URL=http://localhost:3001 npm test
```

The Playwright spec builds history `/page1 -> /page2`, delays `/_next/static/**` by
`JS_DELAY` (default 400ms) to widen the reported race window, triggers `location.reload()`,
then presses Back after `delay` ms and waits 3s before asserting that the rendered
`#content` matches the pathname.

## Observed

next 15.5.4 (`next start`, production build): 16 / 24 iterations end with
`url=/page1` but `content=page2`. Every iteration with Back pressed before the bundle
landed (delay 50–400ms) is stale; iterations at 450–600ms are correct.

next 16.3.1-canary.25 with the same app/spec: 0 / 24 mismatches.

Manual repro: `npm run build && npm start`, go to /page1, click Page 2, then hit reload and
Back as fast as possible (throttle the network to make it easy).
