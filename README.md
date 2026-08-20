# Repro: `next/image` `onLoad` fires late (vercel/next.js#64458)

`next/image` never uses the native `onload` attribute. It calls the user's `onLoad`
either from React's synthetic `onLoad` handler or from a `useLayoutEffect` that checks
`img.complete` — both of which only run **after hydration**. So when the image finishes
downloading before the client JS bundle is executed, the loading placeholder styles stay
applied to an already fully painted image until hydration completes.

## Run

```bash
npm install
npx playwright install chromium
npm run build && npm start        # in one terminal
npm test                          # in another terminal
```

`measure.mjs` loads the page in Chromium, delays only `/_next/static/**.js` responses
(default 3000 ms, `JS_DELAY` env var) to emulate a slow bundle, and compares:

- `nativeImgLoadAtMs` — document-capture `load` event of the `<img>` (real load time)
- `nextImageOnLoadAtMs` — when `next/image` invokes the `onLoad` prop

## Observed (next 16.3.1, react 19.2.0)

```json
{ "jsBundleDelayMs": 3000, "nativeImgLoadAtMs": 42, "nextImageOnLoadAtMs": 3170,
  "onLoadLagMs": 3128,
  "stateWhenImageFinishedDownloading": { "complete": true, "naturalWidth": 400,
    "opacity": "0.25", "wrapperBg": "rgb(255, 0, 0)" } }
```

With `JS_DELAY=0` the lag is still ~118 ms. Screenshots are written next to
`measurements.json`.
