# Repro: parallel slot with kebab-case name breaks the webpack build (issue #56330)

Next.js `16.3.1-canary.25`.

`app/parallel-routes/@parallel-panel/page.tsx` is a parallel slot whose folder name
contains a dash. `next-app-loader` emits the slot as an **unquoted** object key
(`parallel-panel: [...]`), so webpack fails to parse the generated loader tree.

## Steps

```bash
npm install
npx next build --webpack   # fails: ModuleParseError: Unexpected token
npx next dev --webpack     # /parallel-routes returns HTTP 500 with the same error
npx next build             # Turbopack: passes
npx next dev               # Turbopack: /parallel-routes renders both slots
```

## Actual (webpack)

```
./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?...
Module parse failed: Unexpected token (23:16)
|         'parallel-routes',
|         {
>         parallel-panel: [
|         '(__SLOT__)',
|         {
```

## Expected

Kebab-case slot names build with webpack, as they already do with Turbopack.
