# next-rspack: `transpilePackages` deps wrongly externalized in `next dev` (pages router, Windows + pnpm)

Reproduction bundle for https://github.com/vercel/next.js/issues/98505
(mirror of the reporter's repro + a platform-independent check of the failing code path).

Next.js 16.3.0 / next-rspack 16.3.0 / pages router / `bundlePagesRouterDependencies` off (default).

## 1. Windows repro (original report)

```bash
pnpm bootstrap          # packs packages/service into vendor/*.tgz, then pnpm install
pnpm repro:rspack       # NEXT_RSPACK=true next dev -p 3100  -> open http://localhost:3100
pnpm repro:webpack      # control group (webpack dev)
```

* Windows + pnpm, rspack dev: `SSR resolve result: FAILED: No matching bindings found for
  serviceIdentifier: Symbol(Config)` and `.next/dev/server/pages/index.js` contains
  `module.exports = require("@demo/service")` even though `@demo/service` is in `transpilePackages`.
* webpack dev and `next build` (rspack): both packages are bundled -> `OK, answer = 42`.

## 2. What happens on Linux/macOS (verified)

`pnpm repro:rspack` prints `OK, answer = 42`; the dev server bundle inlines
`.pnpm/@demo+service@.../node_modules/@demo/service/index.js`. The bug does not
trigger because `path.sep === '/'` there.

To see that the *consequence* is exactly the reported error once the package is
externalized, drop `'@demo/service'` from `transpilePackages` in
`packages/app/next.config.js` and re-run `pnpm repro:rspack`:
`FAILED: No matching bindings found for serviceIdentifier: Symbol(Config)`, with
`require("@demo/service")` in `.next/dev/server/pages/index.js`.

## 3. Platform-independent check of the failing comparison

```bash
node separator-check.mjs   # exits 1: mismatch on win32 paths
```

It models both implementations of `isResourceInPackages`:

* webpack (`packages/next/src/build/handle-externals.ts`) uses `path.sep`.
* next-rspack (`rspack/crates/binding/src/handle_externals.rs`) hard-codes `/`:
  `resource.starts_with(&format!("{dir}/"))` and
  `resource.contains(&format!("/node_modules/{}/", pkg.replace('/', MAIN_SEPARATOR_STR)))`.

On Windows the resource path and the resolved package dir use `\`, so both the
prefix test and the fallback substring test fail, the transpile package is treated
as "not a transpile package" and gets externalized. `@demo/di-core` resolves to a
workspace path with no `node_modules` segment, so it never reaches that check and
stays bundled - hence two `@demo/di-core` instances and two distinct `Symbol('Config')`.
