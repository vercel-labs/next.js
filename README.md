# Repro: issue #86870 — cacheComponents + dynamic segments under a localized `[locale]` segment

Minimal, framework-free reproduction (no i18n library) of
https://github.com/vercel/next.js/issues/86870

## Run

```bash
npm install
npm run build          # fails
# or: npm run dev  -> open http://localhost:3000/en/static/1
```

## Routes

| Route | `generateStaticParams` | Result with `cacheComponents: true` |
| --- | --- | --- |
| `app/[locale]/static/page.tsx` | in `[locale]/layout.tsx` | prerendered per locale (`/en/static`, `/fr/static`) |
| `app/[locale]/static/[id]/page.tsx` | only for `[locale]` | **build error**: uncached/runtime data (`params`) accessed outside `<Suspense>` for `/en/static/[id]` |
| `app/[locale]/gsp/[id]/page.tsx` | `[locale]` + `[id]` | prerendered for every locale × id combination |
| `app/plain/[id]/page.tsx` | none | same build error — the failure is not i18n specific |

## Observed

Next.js 16.0.7 and 16.3.1 (Turbopack, Cache Components) both fail the build on
`/[locale]/static/[id]`. Awaiting `params` in a dynamic segment that has no
`generateStaticParams` of its own is treated as runtime data, so any i18n
framework that needs `locale` from `params` in a nested dynamic route turns the
whole page dynamic. Declaring `generateStaticParams` at *every* dynamic segment
is the working workaround.
