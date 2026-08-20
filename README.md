# Repro: `Error: Route did not complete loading` causes a full page reload (Pages Router)

Issue: https://github.com/vercel/next.js/issues/62678

Deterministic version of the reporter's manual "Slowest 3G + 6x CPU" repro: a proxy delays
**only** the `/about` page chunk by 8s, which is longer than the Pages Router
`MS_MAX_IDLE_DELAY = 3800` timeout in `next/dist/client/route-loader`.

## Run

```bash
npm install
npx playwright install chromium
npm run build
npm start &          # Next.js production server on :3000
npm run proxy &      # slow-asset proxy on :3100
npm run repro        # Playwright: opens :3100, clicks the router.push button
```

## Observed (next@15.5.4, also reported on 14.1.0 / 14.2.4)

```
+0.16s [chunk request] /_next/static/chunks/pages/about-*.js       (delayed 8s by proxy)
+3.97s [console.error] routeChangeError for /about: Route did not complete loading: /about
+3.97s [document request] http://localhost:3100/about              <-- hard navigation
```

`Router.handleRouteInfoError` treats the asset timeout as an asset error and calls
`handleHardNavigation`, so the client-side navigation becomes a full page reload and all
client state (e.g. a partially filled multi-step form) is lost.
