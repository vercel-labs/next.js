# Repro for vercel/next.js#52314 — URL containing two locales resolves the wrong locale

Minimal Pages Router app with `i18n: { locales: ['en','fr'], defaultLocale: 'en', localeDetection: false }`,
a `middleware.js` that logs `req.nextUrl.pathname` / `req.nextUrl.locale`, and a dynamic `pages/[slug].js`.

## Run

```bash
npm install
npm run dev        # or: npm run build && npm start
curl -i http://localhost:3000/en/fr     # BROKEN: 404
curl -i http://localhost:3000/fr/foo    # OK: 200, slug=foo locale=fr
```

## Observed

`next@15.5.4` (dev and prod), request `GET /en/fr`:

- middleware logs `pathname: /fr  locale: en`
- server logs `The detected locale does not match the locale in the query. Expected to find 'en' in '/fr' but found 'fr'}`
- response is **404** even though `pages/[slug].js` exists (`/fr/foo` returns 200)

`next@14.2.33`, same request: hard **500** with
`Error: Invariant: The detected locale does not match the locale in the query. Expected to find 'en' in '/fr' but found 'fr'}`
thrown from `I18NProvider.fromQuery` (`server/future/helpers/i18n-provider.js`).

`next@16.3.1-canary.25`: fixed — `GET /en/fr` returns 200 with `slug=fr`, `locale=en`.
The throw was downgraded to `console.warn` in `server/lib/i18n-provider.js` on canary.

## Expected

`/en/fr` should be treated as locale `en` + pathname `/fr` and render `pages/[slug].js`
(or a 404 page in the `en` locale when no matching route exists), without a locale mismatch warning/error.

To check other versions: `npm i next@14.2.33` / `npm i next@canary` and rerun.
