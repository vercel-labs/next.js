# Reproduction for vercel/next.js#77093

`next dev --turbopack` forwards `NODE_OPTIONS="--require ./node-require.js"` into the
Turbopack webpack-loaders worker process, so the required module is loaded there too.

## Steps

```bash
npm install
npm run dev
curl http://localhost:3000
```

A Sass import in `app/layout.jsx` makes Turbopack spawn its webpack-loaders worker.

## Observed

`node-require.js` logs three times: the `next` CLI, `start-server.js`, and the
Turbopack webpack-loaders worker (`.next/dev/build/chunks/pool_entry-[turbopack-node]_transforms_webpack-loaders_ts_*.js`).

## Expected

Per the report, the loader worker should not inherit `--require` (or there should be an opt-out).
