# serverExternalPackages ignored for workspace (symlinked) packages

Reproduction for https://github.com/vercel/next.js/issues/43433

pnpm workspace with `packages/native` (a workspace package that `require()`s a
`.node` addon) consumed by `apps/web`. `apps/web/next.config.js` lists the
package in `serverExternalPackages`, but Next still bundles it.

## Run

```bash
pnpm install
pnpm build            # turbopack build -> fails
pnpm build:webpack    # webpack build   -> "Module parse failed" on native.node
```

## Observed (next@16.3.1-canary.24)

Turbopack:

```
./packages/native/index.js
Error: non-ecmascript placeable asset
[project]/packages/native/native.node (node addon) is not placeable in ESM chunks
```

Webpack (`next build --webpack`):

```
../../packages/native/native.node
Module parse failed: Unexpected character '\x7f' (1:0)
Import trace for requested module:
../../packages/native/native.node
../../packages/native/index.js
./app/page.js
```

## Control

Replacing the `apps/web/node_modules/@repro/native` symlink with a real
directory copy makes the same webpack build compile successfully (the package is
then externalized and `require`d at runtime), showing the failure is specific to
symlinked workspace packages.
