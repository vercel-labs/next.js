# Repro: tree shaking not working for pages with `transpilePackages` (vercel/next.js#71561)

pnpm workspace: `shared` (a `transpilePackages` + `optimizePackageImports` workspace package,
`sideEffects: false`) and `web` (Pages Router).

`shared/src/consts/common.ts` exports `bla`, `foo`, `bar`.
- `web/src/pages/_app.tsx` imports only `foo`
- `web/src/pages/test.tsx` imports only `bla`
- nothing imports `bar`

Expected: the `/_app` bundle contains `foo` only; `bla` ships in the `/test` chunk.
Actual: the `/_app` bundle contains both `foo` and `bla` (`bar` is correctly removed),
so every export of the module that any page uses is pulled into the always-loaded `_app` bundle.

## Run

```bash
pnpm install
pnpm build      # Turbopack (default in Next 16)
pnpm verify     # exits 1 and prints FAIL when `bla` leaked into /_app
```

Webpack build (`cd web && pnpm build:webpack`, then `pnpm verify` at the root) shows the
same result, as does Next.js 14.2.15 / 15.x.
