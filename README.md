# Repro: vercel/next.js#31420 — locale value as dynamic route slug 404s

Pages Router app with `i18n: { defaultLocale: 'en', locales: ['en','de','us'] }` and `pages/[slug]/index.js`.

## Run
```
npm install
npm run dev
curl -o /dev/null -w '%{http_code}\n' http://localhost:3000/en/test   # 200 -> /[slug]
curl -o /dev/null -w '%{http_code}\n' http://localhost:3000/en/en     # 404
curl -o /dev/null -w '%{http_code}\n' http://localhost:3000/en/de     # 404
```

## Observed on next@16.3.1 (dev and `next build && next start`)
- `/`, `/en`, `/de`, `/us` -> index page (expected)
- `/en/test` -> `/[slug]` with `query.slug === 'test'` (expected)
- `/en/en`, `/en/de`, `/de/en`, `/us/en` -> 404 instead of `/[slug]` with the locale string as slug
- `/en/en/test` -> 404

The original report (multiple locale prefixes all rendering the index page) no longer happens;
the remaining problem is that a slug whose value equals a configured locale is unroutable.
