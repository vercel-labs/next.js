# Repro: next.config.js `i18n` breaks App Router routes (vercel/next.js#53724)

```bash
npm install
npm run dev
curl -i http://localhost:3000/de/localized-route   # 404
curl -i http://localhost:3000/unlocalized-route    # 200
```

`app/[locale]/page.tsx` and `app/[locale]/localized-route/page.tsx` return 404 whenever
the Pages Router `i18n` key is present in next.config.js (the locale prefix is stripped
before App Router matching: dev log shows `GET /localized-route 404`).
Removing the `i18n` key makes `/de` and `/de/localized-route` return 200.

Verified on next@16.3.1-canary.8, Node 24.
