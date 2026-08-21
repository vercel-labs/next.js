# Repro: vercel/next.js#76592

App-Router-only app on **next@15.2.0** with **react@18.3.1 / react-dom@18.3.1**.

```bash
npm install
npm run build     # writes .next/analyze/client.html
npm run inspect
```

## Observed on next@15.2.0

* `First Load JS shared by all` = **117 kB** (`105 kB` with next@15.1.7, same app) — matches the
  reporter's 106 kB -> 118 kB regression.
* The app-router shared chunk grows from 199 kB to 232 kB parsed. Newly bundled modules include
  `next/dist/client/app-dir/link.js` (+ `shared/lib/utils.js`, `format-url.js`, `querystring.js`)
  even though the app never imports `next/link`: `client/components/app-router.js` now does
  `require('../app-dir/link')` for `pingVisibleLinks`. The production error plumbing under
  `client/components/errors/*` is also new.
* Two react-dom copies exist in the client build:
  * `next/dist/compiled/react-dom/cjs/react-dom-client.production.js` (19.1.0-canary-22e39ea7-20250225)
    in the app-router chunk `4bd1b696-*.js`
  * the user's `react-dom@18.3.1` (`react-dom.production.min.js`) in `framework-*.js`, which is
    emitted only for the always-present Pages Router `/_app` + `/_error` entries.
  `app-build-manifest.json` shows app routes do **not** load `framework-*.js`, so the two copies are
  not shipped on the same page — but both show up together in `client.html` from the analyzer.

To compare against 15.1.7: `npm i next@15.1.7 @next/bundle-analyzer@15.1.7 && rm -rf .next && npm run build`.
