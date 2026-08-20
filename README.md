# Repro: middleware matcher does not match root path when `basePath` is set (#73786)

```bash
npm install
npm run dev
curl -i http://localhost:3000/base-path        # 200 -> middleware NOT executed (bug)
curl -i http://localhost:3000/base-path/other  # 307 -> middleware executed
```

`next.config.js` sets `basePath: '/base-path'` and `middleware.js` uses the common matcher
`'/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'`.

The generated matcher in `.next/server/middleware-manifest.json` is:

```
^\/base-path(?:\/(_next\/data\/[^/]{1,}))?(?:\/((?!api|...).*))(\.json|\.rsc|...)?[\/#\?]?$
```

The `basePath` prefix is followed by a mandatory `\/`, so the base-path root `/base-path`
(no trailing slash) never matches. Removing `basePath` makes `/` match; adding an explicit
`'/'` matcher entry works around it. Reproduced on next 15.0.4 and 16.3.1-canary.25,
in `next dev` and `next start`.
