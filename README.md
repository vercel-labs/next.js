# Reproduction for vercel/next.js#83248

`Cannot find module 'next/dist/compiled/source-map'` — every route/API route
returns **500** in a production (Vercel) deployment, while `next dev` is fine.

The reporter's linked repo (`pranshu05/demo-next-issue`) is no longer public, so
this is a minimal re-creation based on the reported config.

## Root cause shown here

`next.config.mjs` sets `outputFileTracingRoot` to an absolute path that does not
contain the project. Build traces are then computed against that wrong root, so
`next-server.js.nft.json` lists ~30 files instead of ~1850 and does **not**
include `next/dist/compiled/source-map`. That module is required at server
startup by `next/dist/server/node-environment-extensions/error-inspect.js`
(-> `patch-error-inspect.js`), so the Vercel lambda crashes before handling any
request.

## Versions

Reproduces on the reported `next@15.5.2` and on the latest 15.x (`15.5.23`,
pinned here because Vercel refuses to deploy 15.5.2 due to CVE-2025-66478).

## Run

```bash
npm install
npm run verify   # broken config: ~30 traced files, no compiled/source-map, no .next/standalone
```

Then comment out `outputFileTracingRoot` in `next.config.mjs` and re-run
`npm run verify`: ~1850 traced files, `compiled/source-map` present,
`GET /api/hello -> 200 {"ok":true}`.

## Observed crash (standalone server run outside the repo, i.e. no fallback
## node_modules like a Vercel lambda)

```
Error: Cannot find module 'next/dist/compiled/source-map'
Require stack:
- node_modules/next/dist/server/patch-error-inspect.js
- node_modules/next/dist/server/node-environment-extensions/error-inspect.js
- node_modules/next/dist/server/node-environment.js
- node_modules/next/dist/server/lib/router-server.js
- node_modules/next/dist/server/lib/start-server.js
- server.js
```
