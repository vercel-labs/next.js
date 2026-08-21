# Reproduction for vercel/next.js#87243

Turbopack on Windows: Sass `@use` / `@forward` imports fail to resolve.

```bash
npm install
npm run dev        # Turbopack
npm run dev:webpack # comparison
```

Then open http://localhost:3000.

## Cases

1. `app/globals.scss` -> `src/case1-forward.scss` (`@forward 'styles/breakpoints'`) ->
   `src/styles/_breakpoints.scss` (`@use './rem'`): relative import inside an `@forward` chain.
2. `app/globals.scss` -> `src/case2-nodemodules.scss` (`@use 'ag-grid-community/styles'`) ->
   `node_modules/ag-grid-community/styles/_index.scss` (`@use './css-content'`): relative
   import inside a node_modules package.
3. `src/case3-includepaths.scss` (`@use 'rem'`), resolved only through `sassOptions`.
   Uncomment its import in `app/globals.scss` to test.

## Results observed on Linux (Next.js 16.0.10, sass 1.95.0)

* Cases 1 and 2 compile successfully with Turbopack (HTTP 200, CSS emitted), so the
  reported failure is Windows-specific and needs a Windows host to confirm.
* Case 3 fails with `Can't find stylesheet to import.` under Turbopack **and** under
  `--webpack` when `sassOptions.includePaths` is used, and passes on both bundlers when
  the option is renamed to `sassOptions.loadPaths`. So the `includePaths` part of the
  report is not Turbopack- or Windows-specific: Next 16 uses the modern Sass API, which
  only honours `loadPaths`.
