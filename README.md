# Reproduction for vercel/next.js#61320 — with-mobx: many re-renders on query/route change

Minimal port of the reporter's repro (https://codesandbox.io/p/github/realing29/next_mobx_ssr_hydration_bug)
with Chakra UI / axios / network calls removed. `getStaticProps` returns `hydrationData`,
`StoreProvider` calls `store.hydrate(initialData)` during render (as in the official
`examples/with-mobx` StoreProvider), and `<Page>` is a mobx `observer`.

## Run

```bash
npm install
npm run dev   # http://localhost:3000/ssg/1
```

Click "two" (route change /ssg/1 -> /ssg/2) and watch the console:
`_app.js` and `Page` log one line per render. A single route change produces
~10-30 renders instead of 1-2. In dev, React also logs:
"Cannot update a component (`Page`) while rendering a different component (`StoreProvider`)".

`npm run build && npm start` shows the same repeated renders in production.

The render count scales with the size of `hydrationData` (`copies` in `pages/ssg/[id].js`):
copies=1 -> 2 renders, copies=5 -> 3, copies=25 -> 10-34.
