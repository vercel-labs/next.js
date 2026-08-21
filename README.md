# Repro: Turbopack standalone omits `serverExternalPackages` from `.next/standalone/node_modules` (#88844)

Minimal reproduction of https://github.com/vercel/next.js/issues/88844 on Next.js 16.1.4 with pnpm (isolated node-linker).

```bash
pnpm install
pnpm build      # Turbopack (default)
pnpm verify     # exits 1: ts-deepmerge missing from .next/standalone/node_modules

pnpm build:webpack
pnpm verify     # exits 0: node_modules/ts-deepmerge symlink present
```

## Observed (Turbopack)

```
.next/standalone/node_modules            -> [ .pnpm, next, react, react-dom, typescript ]   (no ts-deepmerge)
.next/standalone/.next/node_modules      -> ts-deepmerge-1926c4f5c6929741
    -> ../../node_modules/.pnpm/ts-deepmerge@7.0.3/node_modules/ts-deepmerge
```

## Observed (`next build --webpack`)

```
.next/standalone/node_modules            -> [ .pnpm, next, ts-deepmerge, typescript ]
  ts-deepmerge -> .pnpm/ts-deepmerge@7.0.3/node_modules/ts-deepmerge
```

## Notes from running it

* The layout divergence between Turbopack and webpack is reproducible and deterministic.
* With pnpm the copied `.pnpm` store *is* inside `.next/standalone`, so an unmodified copy of
  `.next/standalone` (+ `.next/static`) does boot and `GET /dyn` (which requires the external
  package at request time) returns 200. The reported `Cannot find module` crash therefore only
  appears when the hashed symlinks under `.next/standalone/.next/node_modules` are lost or not
  copied (e.g. artifact archives that drop symlinks, or Dockerfiles copying only a subdirectory
  of the standalone tree in a monorepo).
* With npm (hoisted) Turbopack does place `ts-deepmerge` in `.next/standalone/node_modules`, so
  the missing top-level entry is specific to pnpm's isolated layout.
