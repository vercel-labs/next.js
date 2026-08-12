# Repro: dynamic Pages Router API routes 404 on Vercel with `i18n` (next 16.3.0)

Issue: https://github.com/vercel/next.js/issues/97230

## Run

```
npm install
npm run build && npm start          # local: /api/static 200, /api/dynamic/123 200
```

Then deploy this directory to Vercel and request:

```
curl -si https://<deployment>/api/static        # 200, x-matched-path: /api/static
curl -si https://<deployment>/api/dynamic/123   # 404, x-matched-path: /de/404
```

## Observed (Vercel deployments of this exact code)

| config | next | /api/static | /api/dynamic/123 |
|---|---|---|---|
| `i18n: { locales: ['de'], defaultLocale: 'de' }` | 16.3.0 | 200 | **404 (x-matched-path: /de/404)** |
| no `i18n` | 16.3.0 | 200 | 200 (x-matched-path: /api/dynamic/[id]) |
| `i18n` | 16.2.12 | 200 | 200 |

Reproduces with both `next build --webpack` and the default Turbopack build.
`next start` locally on the same 16.3.0 build returns 200 for both routes;
`.next/routes-manifest.json` is byte-identical between 16.2.12 and 16.3.0.
