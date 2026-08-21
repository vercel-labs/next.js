# Repro: incorrect HTTP status from non-streaming generateMetadata (vercel/next.js#82041)

`htmlLimitedBots: /.+/` blocks *metadata* streaming, but a root `app/loading.js`
suspense boundary still commits the HTML response early, so `notFound()` /
`redirect()` thrown from `generateMetadata()` return **200** instead of 404 / 307.

## Run

```bash
npm install
npm run build
npm start
curl -s -o /dev/null -w "%{http_code}\n" -A "Googlebot/2.1" http://localhost:3000/throw-not-found  # 200 (expected 404)
curl -s -o /dev/null -w "%{http_code} %header{location}\n" -A "Googlebot/2.1" http://localhost:3000/throw-redirect # 200 (expected 307)
```

Delete `app/loading.js`, rebuild, and the same requests return `404` and
`307 /redirect-destination`. Same result in `next dev`.

Verified with next@16.3.1-canary.26.
