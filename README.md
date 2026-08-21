# Repro: minified vendor CSS `sourceMappingURL` is copied verbatim into `app/layout.css` (404 on the map)

Upstream issue: https://github.com/vercel/next.js/issues/80208
(The reporter's repo `Huink7/css-map-reproduction` no longer exists, so this is a fresh minimal repro.)

`vendor/bootstrap.min.css` ends with `/*# sourceMappingURL=bootstrap.min.css.map */` and is imported from `app/layout.tsx`.

## Run (webpack dev — reproduces)

```bash
npm install
npx next dev --webpack -p 3001
# in another shell
curl -s http://localhost:3001/ > /dev/null
curl -s http://localhost:3001/_next/static/css/app/layout.css | tail -2
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/_next/static/css/app/bootstrap.min.css.map
```

Result: served `layout.css` still contains `/*# sourceMappingURL=bootstrap.min.css.map */`, which resolves to
`/_next/static/css/app/bootstrap.min.css.map` → **404**. Safari (with CSS source maps enabled) surfaces this as
"Source Map loading errors" and keeps re-requesting.

## Turbopack (default, `npx next dev`) — not affected

The comment is rewritten to `/*# sourceMappingURL=vendor_bootstrap_min_<hash>.css.map*/` and that URL returns 200.
