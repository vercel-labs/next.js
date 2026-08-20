# Repro: locale negotiation ignores region subtags (vercel/next.js#18676)

next.config.js: `i18n: { locales: ['en','fr'], defaultLocale: 'en' }`

```
npm install
npm run dev
curl -si -H 'Accept-Language: fr-FR' http://localhost:3000/     # expected 307 -> /fr, actual 200 (en)
curl -si -H 'Accept-Language: fr'    http://localhost:3000/     # 307 -> /fr (works)
curl -si -H 'Accept-Language: fr-XX,en' http://localhost:3000/  # actual en
```

Root cause: `next/dist/server/accept-header.js` `acceptLanguage()` only expands
configured locales into their *prefixes* (`prefixMatch`), so a header tag that is
more specific than a configured locale (`fr-FR` vs configured `fr`) never matches
and detection falls back to `defaultLocale`.

Note: locale detection redirects only happen on `/`, so `/some-id` always renders
`defaultLocale` regardless of the header.
