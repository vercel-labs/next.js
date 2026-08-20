# Repro: static App Route returning 204 throws in production (`next start`)

Issue: https://github.com/vercel/next.js/issues/49005

## Run

```bash
npm install
npm run build
npm start
# in another shell
curl -i http://localhost:3000/api/get-200-static   # 200 OK
curl -i http://localhost:3000/api/get-204-static   # 500 (expected 204)
curl -i http://localhost:3000/api/get-205-static   # 500 (expected 205)
curl -i http://localhost:3000/api/get-204-nextresponse # 500 (expected 204)
```

Server log:

```
⨯ TypeError: Response constructor: Invalid response status code 204
```

`next dev` returns 204/205 correctly; only prerendered/cached responses served by
`next start` fail. Root cause: `packages/next/src/build/templates/app-route.ts`
does `new Response(cacheEntry.value.body, { status: cacheEntry.value.status || 200 })`,
and the cached body is an (empty) Buffer, which is illegal for null-body statuses
(101/204/205/304).
