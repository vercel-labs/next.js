# Repro for vercel/next.js#63469 — documented polyfills only ship via `nomodule`

The polyfills listed on https://nextjs.org/docs/architecture/supported-browsers (e.g.
`Promise.allSettled`) are injected with the `nomodule` attribute, so they are never delivered
to any browser that supports ES modules — even though such browsers can predate those APIs
(Chrome supports ESM from 61, but `Promise.allSettled` only from 76).

## Run

```bash
npm install
npx playwright install chromium
npm run build:webpack   # webpack: polyfill script emitted with the noModule attribute
npm start &
npm run check           # Playwright: emulates an ESM-capable browser without Promise.allSettled
```

`check.mjs` deletes `Promise.allSettled` before page load (emulating Chrome 61-75) and reports
whether the polyfill chunk is fetched/applied.

## Observed (next@16.3.1, webpack build)

```
polyfill script tag in HTML: <script defer="" noModule="" src="/_next/static/chunks/polyfills-<hash>.js">
polyfill chunk requested by modern browser: false
window.Promise.allSettled after hydration: undefined
rendered text: allSettled type: undefined
```

`npm run build` (Next 16 default Turbopack) emits no `polyfills-*.js` script in the HTML at all.
Identical `nomodule` behavior confirmed on next@14.1.4 (the version in the issue report).
