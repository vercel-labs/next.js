# Repro: Pages Router dynamic API routes 404 on Vercel with `i18n` (next 16.3.0)

Issue: https://github.com/vercel/next.js/issues/97231

## Run

```bash
npm install
npm run build   # next build --webpack
npm start       # local: /api/static -> 200, /api/dynamic/123 -> 200
```

Then deploy the same directory to Vercel and request both routes:

```bash
curl -i https://<deployment>/api/static      # 200
curl -i https://<deployment>/api/dynamic/123 # 404, x-matched-path: /de/404
```

## Observed

| next | next.config.js | /api/static | /api/dynamic/123 (Vercel) |
|---|---|---|---|
| 16.3.0 | `i18n: { locales: ['de'], defaultLocale: 'de' }` | 200 | **404** (`x-matched-path: /de/404`) |
| 16.3.0 | no `i18n` | 200 | 200 (`x-matched-path: /api/dynamic/[id]`) |
| 16.2.12 | same `i18n` | 200 | 200 |

`next start` with the identical production build serves 200 in all cases; only the Vercel
deployment 404s. `.next/routes-manifest.json` is byte-identical between 16.2.12 and 16.3.0
for this app (same `dynamicRoutes` entry and `i18n` block).
