# Repro: Turbopack fails on `composes` inside `@layer` (CSS Modules)

Upstream issue: https://github.com/vercel/next.js/issues/85200

Based on https://github.com/doug-stewart/css-module-bug with a missing `src/app/layout.tsx`
added (the original repo lacks a root layout, so the webpack comparison build fails for an
unrelated reason).

## Steps

```sh
npm install
npm run build          # next build --turbopack -> FATAL TurbopackInternalError
npm run build:webpack  # next build --webpack   -> succeeds
```

## Observed

`src/components/component-b/ComponentB.module.css` wraps a `composes` declaration in `@layer base`.
Turbopack (lightningcss) fails:

```
Error [TurbopackInternalError]: Failed to write app endpoint /page
Caused by:
- [project]/src/components/component-b/ComponentB.module.css [app-rsc] (css module)
- The `composes` property cannot be used within nested rules at .../ComponentB.module.css:4:14
```

Reproduced with next@15.5.6 and next@16.3.1-canary.26. The webpack build compiles fine.
