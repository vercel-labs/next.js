# Repro: `URL.parse()` not polyfilled (vercel/next.js#72914)

Next.js injects `@next/polyfill-module` into every page for **all** browsers.
That polyfill defines the static `URL.canParse()` but not `URL.parse()`
(`packages/next-polyfill-module/src/index.js`), so on any engine released
before both statics landed (Safari 17, Chrome/Edge < 126, Firefox < 126) a
component calling `URL.parse()` crashes with
`TypeError: URL.parse is not a function` while `URL.canParse()` works.

The legacy `@next/polyfill-nomodule` bundle does ship `URL.parse` (it comes in
transitively from `core-js@3.38.1`'s `features/url`), so the two polyfill
bundles disagree.

## Run

```bash
npm install
npx playwright install chromium
npm run build && npm start &     # or: npm run dev
npm run verify
```

`verify-polyfill.mjs` launches Chromium, deletes `URL.parse`/`URL.canParse`
before any page script runs (emulating Safari 17), loads `/client`, and prints
what the app sees.

## Observed (next@15.5.4, `next start` and `next dev`)

```
after Next.js polyfills loaded -> URL.parse=undefined URL.canParse=function
URL.parse("https://vercel.com") -> ERROR: URL.parse is not a function
legacy nomodule bundle -> { parse: 'function', canParse: 'function' }
```

Expected: `URL.parse` polyfilled too (core-js has `web.url.parse`).

Note: the server-side `TypeError` in the original report comes from Node 20.9
(static `URL.parse` was added in Node 20.18/22.1) and the `next build` type
error from `typescript@5.3.3`/old `@types/node`; neither is polyfilled by
Next.js.
