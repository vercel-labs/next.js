# Repro: proxy negative matcher ignored on Vercel when `i18n` is configured (next.js#86241)

Next.js 16.3.1 (also 16.0.2-canary.23), Pages Router, `i18n` in `next.config.mjs`,
`proxy.js` matcher:

```js
matcher: ['/', '/((?!api|_next/static|_next/image|login|favicon.ico|sitemap.xml|robots.txt).*)']
```

## Run

```bash
npm install
npm run build
# inspect the compiled matchers used by Vercel's routing layer:
cat .next/server/functions-config-manifest.json
npm start   # self-hosted: negative matching is respected
```

Compiled matcher for source `'/'` with i18n enabled:

```
^(?:\/(_next\/data\/[^/]{1,}))?(?:\/((?!_next\/)[^/.]{1,}))(|\.json|\/?index|\/?index\.json|\/?index(?:\.rsc|\.segments\/.+\.segment\.rsc))?[\/#\?]?$
```

The injected locale segment `(?:\/((?!_next\/)[^/.]{1,}))` is required, not optional, so:

* `/` does NOT match (proxy skipped on the one path explicitly listed)
* `/login`, and `/_next/data/<buildId>/login.json` DO match (locale group swallows `login`),
  even though `login` is excluded by the second matcher.

## Observed on Vercel

`GET /_next/data/<buildId>/login.json` runs the proxy and answers
`307` + `x-nextjs-redirect: /login`, so any client-side navigation to `/login`
redirect-loops. Self-hosted `next start` returns `200` for the same request.
