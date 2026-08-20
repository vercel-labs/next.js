# Repro: `typedRoutes` — `Route<T> | URL` prop rejected by `<Link href>` (vercel/next.js#47689)

## Run

```bash
npm install
npx next typegen   # or: npx next build
npx tsc --noEmit
```

## Expected

No type errors.

## Actual (next@16.3.1-canary.25, typescript 5.9.3)

```
components/BackButton.tsx(9,16): error TS2322: Type 'StaticRoutes | ... | `/pokedex/${string}` | ... | URL' is not assignable to type 'UrlObject | RouteImpl<URL>'.
  Type '`/pokedex/${string}`' is not assignable to type 'UrlObject | RouteImpl<URL>'.
components/Variants.tsx(17,16): error TS2322: Type 'URL | Route<T>' is not assignable to type 'UrlObject | RouteImpl<URL>'.
```

`components/BackButton.tsx` (prop typed `Route<T> | URL`) and `components/Variants.tsx` export `C`
(callback returning `Route<T> | URL`, the original report) both fail: when `URL` is part of the union,
`Link`'s `RouteType` generic infers as `URL`, so `RouteImpl<URL>` loses the dynamic-route branch
(`T extends \`${DynamicRoutes<infer _>}${Suffix}\` ? T : never` resolves to `never`) and any
`/pokedex/[id]` route string becomes unassignable.

Controls that type-check fine in the same project:
- `components/BackButtonRouteOnly.tsx` — `href: Route<T>`
- `Variants.tsx` `A` — `href: Route<T> | UrlObject`
- `Variants.tsx` `B` — `href: URL`
- `Variants.tsx` `D`/`DUse` — `href: Route<T>` receiving `"/pokedex/1"`
