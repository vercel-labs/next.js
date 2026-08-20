# Repro: vercel/next.js#69679 — catch-all inside dynamic segment ignores `dynamicParams = false`

`app/[locale]/layout.js` sets `dynamicParams = false` and `generateStaticParams()` returns only `{ locale: 'en' }`.

## Run
```
npm install
npm run dev   # or: npm run build && npm start
```

## Expected vs actual (Next.js 16.3.1, Turbopack, dev and next start)
| URL | Expected | Actual |
| --- | --- | --- |
| /en | 200 | 200 |
| /de | 404 | 404 |
| /de/docs | 404 | **200** |
| /de/a/b | 404 | **200** |

`next build` marks `/[locale]/[...slug]` as `ƒ (Dynamic)` despite the parent segment's `dynamicParams = false`.
