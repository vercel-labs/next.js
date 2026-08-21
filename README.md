# Repro: `conf` passed to `next()` in a custom server is ignored (vercel/next.js#87429)

`basePath` (and other core settings) supplied through the documented `conf` option of
`next({ dev, conf })` has no effect when there is **no** `next.config.*` file.

## Run (dev)

```bash
npm install
node repro.mjs
```

Observed with next@16.1.1-canary.0:

```
/ -> 200
/config-test -> 404
```

Expected (basePath `/config-test` applied): `/ -> 404`, `/config-test -> 200`.

## Run (production)

```bash
npm install
npx next build
NODE_ENV=production node server.mjs
curl -o /dev/null -w '%{http_code}\n' http://localhost:3000/config-test   # 404
```

## Control

Create `next.config.mjs` with the same options and re-run: `/ -> 404`, `/config-test -> 200`.

```js
export default { devIndicators: false, basePath: '/config-test' }
```
