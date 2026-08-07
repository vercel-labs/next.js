# Reproduction for vercel/next.js#96931

Dynamic Pages API routes stop matching on Vercel when `i18n` is configured in Next.js 16.3.0.

The Vercel routing layer resolves an incoming request through the default locale
(`x-matched-path: /en/404` in the report). Since
`668cd3a4a7da71e4402abf9a818e89e0476f275e` (PR #94905) the adapter build output
emits dynamic **API** route matchers without the `nextLocale` prefix, so the
locale-prefixed path no longer matches any dynamic route.

This repo captures the adapter build output (`adapter.js` implements
`onBuildComplete` and is wired up through `adapterPath` in `next.config.js` —
the same hook Vercel's build adapter uses) and replays request paths against the
emitted matchers.

## Run

```bash
npm install
npx next build --webpack
node check.mjs
```

## Result with next@16.3.0 (broken)

```
dynamicRoute /api/trpc/[trpc] => ^[/]?/api/trpc/(?<nxtPtrpc>[^/]+?)(?:/)?$ -> /api/trpc/[trpc]?nxtPtrpc=$nxtPtrpc
request /api/trpc/auth.getSession => MATCH /api/trpc/[trpc]?nxtPtrpc=$nxtPtrpc
request /en/api/trpc/auth.getSession => NO MATCH (falls through to the localized 404)
request /es/api/trpc/auth.getSession => NO MATCH (falls through to the localized 404)
```

## Result with next@16.2.12 (working)

```bash
npm i next@16.2.12 && npx next build --webpack && node check.mjs
```

```
dynamicRoute /api/trpc/[trpc] => ^[/]?(?<nextLocale>[^/]{1,})/api/trpc/(?<nxtPtrpc>[^/]+?)(?:/)?$ -> /$nextLocale/api/trpc/[trpc]?nxtPtrpc=$nxtPtrpc
request /en/api/trpc/auth.getSession => MATCH /$nextLocale/api/trpc/[trpc]?nxtPtrpc=$nxtPtrpc
```

Static API routes (`/api/static`) are unaffected because they are matched by the
filesystem step before locale resolution.

Note: `next start` is not affected — locally `/api/trpc/x` returns 200 on both
versions and `/en/api/trpc/x` returns 404 on both. The regression is in the
adapter routing output consumed by the Vercel routing layer.
