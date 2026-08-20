# Repro: next.js#66876 — typed routes ignore params in rewrite sources with a prefix inside the segment

`next.config.js` rewrites:
- `/@:username` -> `/user/:username`
- `/profile/:username` -> `/user/:username` (control, works)

## Run
```
npm install
npx next dev      # generates .next/dev/types/*
npx tsc --noEmit
```

## Observed (next 16.3.1)
`.next/dev/types/routes.d.ts`:
```
type RewriteRoutes = "/@[username]" | "/profile/[username]"
interface ParamMap {
  "/@[username]": {}
  "/profile/[username]": { "username": string; }
}
```
`.next/dev/types/link.d.ts` puts `/@[username]` in `StaticRoutes` instead of `DynamicRoutes`, so:
```
app/page.tsx(3,16): error TS2322: Type '"/@leerob"' is not assignable to type 'UrlObject | RouteImpl<"/@leerob">'.
```

## Expected
`/@${SafeSlug<T>}` in `DynamicRoutes` and `{ username: string }` in `ParamMap`.

## Root cause pointer
`isDynamicRoute(route)` (strict) uses `/\/\[[^/]+\](?=\/|$)/`, which requires a whole path segment to be `[param]`; `@[username]` fails. The same whole-segment assumption exists in `server/lib/router-utils/typegen.ts` (`part.startsWith('[') && part.endsWith(']')`).
