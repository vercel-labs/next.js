# Repro: next/dynamic with a bare `import()` promise is eager under SWC (#60174)

`dynamic(import('../components/Header'))` (promise passed directly instead of a
`() => import(...)` factory) is lazy when compiled by Babel (`next/babel`) but is
loaded eagerly when compiled by SWC / Turbopack.

## Run

```bash
npm install

# A) Babel (babel.config.js is picked up) -> lazy, chunk loads only after clicking
npm run dev -- --webpack

# B) SWC (forceSwcTransforms) -> chunk is fetched on initial page load
SWC=1 npm run dev -- --webpack

# C) Turbopack (default in Next 16, SWC) -> same eager behaviour as (B)
SWC=1 npm run dev
```

Open http://localhost:3000, watch the network panel before clicking "Show Header".

- Babel: `components_Header_js.js` appears only after the click.
- SWC / Turbopack: the Header chunk is requested during the initial load.

`node check.mjs http://localhost:3000 label` automates the check with Playwright
(`npm i playwright && npx playwright install chromium`).

## Compiled output (webpack dev, pages/index.js)

Babel: `dynamic(function () { return __webpack_require__.e("...").then(...) }, {...})`
SWC:   `dynamic(__webpack_require__.e("...").then(...), {...})`  <-- executed at module scope

Verified with next@16.3.1-canary.25 (and originally 14.0.4).
