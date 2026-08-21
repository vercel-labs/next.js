# Repro: next.js#85475 — "use cache" function called from proxy.ts throws `cacheLife() can only be called inside a "use cache" function`

Next.js 16.0.0, `cacheComponents: true`.

## Run

```bash
npm install
npm run dev
curl -i http://localhost:3000/proxied   # 500 + error in terminal
curl -i http://localhost:3000/          # 200, same cached fn works from a page
```

`lib/config.ts` exports a `"use cache"` function that calls `cacheLife('weeks')`.
Calling it from `proxy.ts` (matcher `/proxied`) fails with:

```
Error: `cacheLife()` can only be called inside a "use cache" function.
    at getTenantConfig (lib/config.ts:5:12)
    at proxy (proxy.ts:5:39)
```

The identical call from `app/page.tsx` renders fine (HTTP 200), showing the failure is
specific to the proxy/middleware bundle, where the `"use cache"` directive is not transformed.
