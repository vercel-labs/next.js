# Repro: Next.js #83957 — user timings (performance marks/measures) are lost in App Router

The user-timing marks added in vercel/next.js#8069 (`Next.js-before-hydration`,
`Next.js-hydration`, `Next.js-route-change-to-render`, `Next.js-render`) are only
emitted by the Pages Router client (`packages/next/src/client/index.tsx`).
The App Router client emits none of them.

## Run

```bash
npm install
npm run build
npm start
# then, in another shell:
node check.mjs   # requires `npm i -D playwright && npx playwright install chromium`
```

Or open http://localhost:3000/ (App Router) and http://localhost:3000/pages-page
(Pages Router) and read the `<pre>` block, or run in the console:

```js
performance.getEntriesByType('measure').map((e) => e.name)
```

## Observed with Next.js 16.3.1 (production build)

- `/` (App Router): `marks: []`, `measures: []`
- `/pages-page` (Pages Router): `measures: ["Next.js-before-hydration", "Next.js-hydration"]`
