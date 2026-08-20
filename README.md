# Repro: vercel/next.js#59619

`_next/data` requests with a stale/invalid buildId are not rejected when the path is
rewritten by middleware and `i18n` is configured.

## Run

```bash
npm install
npm run build
npm start &          # next start -p 3000
npm run repro
```

## Observed

next@14.0.4:

```
200 application/json          valid buildId,   rewritten path
200 text/html; charset=utf-8  INVALID buildId, rewritten path   <-- HTML returned for a .json data request
200 application/json          valid buildId,   non-rewritten path
404 text/html; charset=utf-8  INVALID buildId, non-rewritten path
```

next@16.3.1-canary.25:

```
200 application/json  valid buildId,   rewritten path
200 application/json  INVALID buildId, rewritten path   <-- still 200 instead of 404 (stale data served)
200 application/json  valid buildId,   non-rewritten path
404 application/json  INVALID buildId, non-rewritten path
```

Expected: 404 for any `_next/data` request whose buildId does not match, whether or not
middleware rewrote the path. Without the middleware rewrite the 404 works correctly.
