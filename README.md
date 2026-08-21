# Repro: vercel/next.js#86877

Prefixed dynamic segments in `redirects()` sources (`/c:id`, `/a/m:id`) are emitted by
`next typegen` as static routes with empty params, while `/ok/:id` is correct.

## Run

```
npm install
npx next typegen
cat .next/types/routes.d.ts
```

## Actual (next 16.0.7 and 16.3.1)

```
type RedirectRoutes = "/a/m[id]" | "/c[id]" | "/ok/[id]"
interface ParamMap {
  "/a/m[id]": {}
  "/c[id]": {}
  "/ok/[id]": { "id": string; }
}
```

`/a/m[id]` and `/c[id]` should be dynamic routes with `{ id: string }`.

Cause: `isDynamicRoute(route)` is called in strict mode
(`next/dist/shared/lib/router/utils/is-dynamic.js`, `TEST_STRICT_ROUTE = /\/\[[^/]+\](?=\/|$)/`),
which only matches segments that are entirely `[param]`, so `formatRouteToRouteType`
in `server/lib/router-utils/typegen.js` treats `/c[id]` as static.
