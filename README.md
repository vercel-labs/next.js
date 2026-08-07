# Repro: dynamic Pages API routes 404 on Vercel when Pages Router i18n is enabled (vercel/next.js#96935)

Minimal Pages Router app with `i18n` enabled, a static API route (`/api/ping`) and a
dynamic API route (`/api/echo/[slug]`).

## Deployed behavior (reporter's deployment, next 16.3.0)

```
GET /api/ping                -> 200 {"ok":true,"route":"static"}
GET /api/echo/hello          -> 404 (x-matched-path: /en/404)
GET /api/echo/%5Bslug%5D     -> 200 {"ok":true,"route":"dynamic","slug":"[slug]"}
```

Full responses: `vercel-deployment-curl.txt`. Local `next start` returns 200 for
`/api/echo/hello`, so the failure is in the deployment routing table, not the server.

## Root cause reproduced locally, no deployment needed

Next.js hands the platform its routing table through the build adapter
(`onBuildComplete`). `adapter.js` is a diagnostic adapter that dumps
`ctx.routing.dynamicRoutes`.

```bash
npm install
npm run repro
```

Output:

```
=== next@16.2.12 dynamicRoutes ===
[{ "source": "/api/echo/[slug]",
   "sourceRegex": "^[/]?(?<nextLocale>[^/]{1,})/api/echo/(?<nxtPslug>[^/]+?)(?:/)?$",
   "destination": "/$nextLocale/api/echo/[slug]?nxtPslug=$nxtPslug" }]

=== next@16.3.0 dynamicRoutes ===
[{ "source": "/api/echo/[slug]",
   "sourceRegex": "^[/]?/api/echo/(?<nxtPslug>[^/]+?)(?:/)?$",
   "destination": "/api/echo/[slug]?nxtPslug=$nxtPslug" }]
```

In 16.3.0 the emitted matcher for dynamic Pages **API** routes no longer accepts the
locale-prefixed pathname that i18n routing produces before dynamic matching, so the
request falls through to the localized 404. Static API routes still match by filesystem,
which is why `/api/ping` and the encoded `/api/echo/%5Bslug%5D` still return 200.

Introduced in `packages/next/src/build/adapter/build-complete.ts` by
commit `668cd3a4a7da71e4402abf9a818e89e0476f275e` (PR #94905):

```diff
-      const shouldLocalize = config.i18n
+      const shouldLocalize = Boolean(config.i18n) && !isAPIRoute(route.page)
```

Removing `i18n` from `next.config.js` makes the deployed route return 200, matching the
reporter's control deployment.
