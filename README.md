# Repro: next/dynamic preloads missing `crossOrigin` (vercel/next.js#92797)

`next.config.mjs` sets `assetPrefix: 'https://cdn.example.com'` and `crossOrigin: 'anonymous'`.
`app/page.js` is a client component that uses `next/dynamic` to load `app/lazy.js`, so the
`PreloadChunks` component (packages/next/src/shared/lib/lazy-dynamic/preload-chunks.tsx)
emits a `ReactDOM.preload()` for the dynamic chunk.

## Run

```bash
npm install
npm run build
npm start
curl -s localhost:3000 | grep -o '<link[^>]*>'
```

## Observed (next 16.2.3)

```
<link rel="preload" as="script" fetchPriority="low" href="https://cdn.example.com/_next/static/chunks/04r97rtdhhc62.js" crossorigin=""/>
<link rel="preload" href="https://cdn.example.com/_next/static/chunks/13w-~8q3f3mwc.js" as="script" fetchPriority="low"/>
```

React's own bootstrap-script preload carries `crossorigin=""` (anonymous), but the
`next/dynamic` chunk preload emitted by `PreloadChunks` has no `crossorigin` attribute,
so the browser makes a second, non-CORS request for the same script.

Expected: the `preload()` call should pass `crossOrigin` from the Next config
(`process.env.__NEXT_CROSS_ORIGIN`).

Note: the react-loadable manifest entry (and therefore the preload) is only produced when
the `next/dynamic` call lives in a client component; a server-component `dynamic()` call
yields an empty manifest and no preload link.
