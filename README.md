# Repro: `globalThis` set in `instrumentation.js` is `undefined` inside `generateStaticParams`

Issue: https://github.com/vercel/next.js/issues/69042

`instrumentation.js` `register()` sets `globalThis.MY_SINGLETON`. The page's
`generateStaticParams` and the page component both log it.

## Run

```bash
npm install
npm run dev   # then: curl http://localhost:3000/blog/a
npm run build
```

## Observed (next 16.3.1, Node 24)

`next dev`:

```
[instrumentation] register(): set globalThis.MY_SINGLETON= set-in-instrumentation-f3e8dj
[generateStaticParams] pid 855 globalThis.MY_SINGLETON = undefined
[page component]      pid 833 globalThis.MY_SINGLETON = set-in-instrumentation-f3e8dj
```

`generateStaticParams` executes in a different process (the `generate-params`
worker) than the renderer, so singletons created by instrumentation are not
visible there.

`next build`: `register()` never runs, so both logs print `undefined`.

## Expected

The same `globalThis` (singleton) is visible in `generateStaticParams` as in the
component, or the limitation is documented.
