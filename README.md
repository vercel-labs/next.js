# next.js#86562 — legacy JavaScript shipped regardless of `browserslist`

Minimal Pages Router hello-world. `package.json` declares a modern
`browserslist` (`chrome 120`, `safari 17`, `firefox 120`, `edge 120`).

## Run

```bash
npm install
npm run build
node check-legacy.mjs      # exits 1: polyfills found in the main client chunk
npm start                  # then run Lighthouse (mobile, Performance) on http://localhost:3000
```

Optional automated Lighthouse run:

```bash
npx lighthouse http://localhost:3000/ --only-categories=performance --form-factor=mobile \
  --screenEmulation.mobile --output=json --output-path=lighthouse-report.json --quiet
node -e "const r=require('./lighthouse-report.json');const a=r.audits['legacy-javascript'];console.log(a.score,a.displayValue,a.details.items.map(i=>[i.url,i.subItems.items.map(s=>s.signal)]))"
```

## Observed (next 16.0.4, also 16.3.1)

Lighthouse `legacy-javascript` scores 0.5 — "Est savings of 13 KiB" — pointing at the
main client chunk with signals `String.prototype.trimStart/trimEnd`,
`Array.prototype.flat/flatMap/at`, `Object.fromEntries`, `Object.hasOwn`.
`unused-javascript` also flags ~46 KiB in the same chunk.

Cause: `next/dist/client/index.js` (Pages) and `next/dist/client/app-globals.js` (App)
statically `require('../build/polyfills/polyfill-module')`, so the polyfill bundle is
always included and `browserslist` targets never remove it.

## Expected

With modern `browserslist` targets, no legacy polyfills / transforms should be shipped.
