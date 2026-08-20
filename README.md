# Repro: next.js#59823 — NextRequest `[INTERNALS]` type collision across two Next versions in a monorepo

pnpm workspace with two Next.js copies:

- `packages/logger` → `next@13.4.12`, exports `withLogging(req: NextRequest)`
- `apps/web` → `next@14.0.1`, `middleware.ts` passes its own `NextRequest` to `withLogging`

## Run

```bash
pnpm install
pnpm run check   # tsc --noEmit in apps/web
```

## Expected
No type error: both types are `NextRequest`.

## Actual
```
middleware.ts(7,15): error TS2345: Argument of type '.../next@14.0.1/.../NextRequest' is not
assignable to parameter of type '.../next@13.4.12/.../NextRequest'.
  Property '[INTERNALS]' is missing in type ... but required in type ...
```

Still reproduces with `next@15.0.0` + `next@16.3.1-canary.24`. `skipLibCheck: true` does not help,
because the error is in user code. Cause: `NextRequest` declares a public property keyed by the
module-local `unique symbol` `INTERNALS`, which is nominal per installed copy of `next`.
