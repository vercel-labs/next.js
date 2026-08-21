# Repro: next.js#82607 — MUI pages router + Turbopack emotion cache key mismatch

Minimal pages-router app with `@mui/material` + `@mui/material-nextjs/v15-pagesRouter`
(`AppCacheProvider` + `documentGetInitialProps`), Next.js 15.4.6.

## Run

```bash
npm install
npm run dev        # next dev --turbopack  -> http://localhost:3000  (BUG)
npm run dev:webpack# next dev              -> http://localhost:3001  (OK)
```

## Observed

| mode | SSR class | client emotion cache key | console |
|---|---|---|---|
| `--turbopack` | `css-74d805-...` | `mui` | React hydration mismatch error |
| webpack | `mui-74d805-...` | `mui` | clean |

The `AppCacheProvider` cache (`key: 'mui'`) is ignored during SSR under Turbopack, so
the server emits `css-*` class names while the client emits `mui-*`.

Cause hint: in the Turbopack SSR bundle `@mui/material-nextjs/v15-pagesRouter` is loaded
through the external ESM loader (`externalImport("@mui/material-nextjs/v15-pagesRouter")`
in `.next/server/chunks/ssr/[root-of-the-server]__*.js`), so its `@emotion/react`
instance differs from the bundled `@emotion/react` used by `@mui/material`; the
`CacheProvider` React context therefore never reaches MUI's `styled`.

Workaround: uncomment `transpilePackages: ['@mui/material-nextjs']` in `next.config.js`
(SSR then emits `mui-*` and hydration is clean).
