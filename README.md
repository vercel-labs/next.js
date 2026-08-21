# Repro: `Route` type does not include filled-in dynamic routes (next#84363)

With `typedRoutes: true` and an `app/time-card/[id]/page.tsx` route,
`<Link href="/time-card/123">` type-checks, but `const route: Route = '/time-card/123'` fails.

## Run

```bash
npm install
npx next dev      # once, to generate .next/dev/types (routes.d.ts / link.d.ts)
npx tsc --noEmit
```

## Observed

```
app/page.tsx(8,7): error TS2322: Type '"/time-card/123"' is not assignable to type 'Route'.
```

Only the dynamic-route assignment errors. `Route<'/time-card/123'>` and
``Route<`/time-card/${string}`>`` both compile, and an unknown route (`/does-not-exist/123`)
is still correctly rejected (asserted with `@ts-expect-error`).

Cause (generated `.next/dev/types/link.d.ts`):

```ts
type RouteImpl<T> =
  | StaticRoutes
  | SearchOrHash
  | WithProtocol
  | `${StaticRoutes}${SearchOrHash}`
  | (T extends `${DynamicRoutes<infer _>}${Suffix}` ? T : never)

export type Route<T extends string = string> = __next_route_internal_types__.RouteImpl<T>
```

`Link` infers `T` from the `href` literal, so the dynamic branch resolves. A bare `Route`
falls back to `T = string`, and `string extends \`/time-card/${SafeSlug<infer _>}\`` is false,
so the dynamic branch collapses to `never`.

Verified with next@16.3.1-canary.26, typescript 5.8.x.
