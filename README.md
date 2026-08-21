# Reproduction: `usePathname()` returns `string` with Typed Routes enabled (#83092)

https://github.com/vercel/next.js/issues/83092

## Run

```bash
npm install
npm run build   # or: npx tsc --noEmit
```

## Observed

```
app/page.tsx(15,6): error TS2345: Argument of type 'string' is not assignable to parameter of type 'Route'.
app/page.tsx(18,15): error TS2345: Argument of type 'string' is not assignable to parameter of type 'RouteImpl<string>'.
app/page.tsx(20,16): error TS2322: Type 'string' is not assignable to type 'RouteImpl<string> | UrlObject'.
```

`next/dist/client/components/navigation.d.ts` declares `export declare function usePathname(): string;`,
so its result cannot be fed back into `router.push()` / `<Link href>` / any `Route`-typed API without a cast.

Confirmed on next@15.5.2 (`experimental.typedRoutes`) and next@16.3.1-canary.26 (top-level `typedRoutes`).
