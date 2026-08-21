# Repro: Turbopack fails to resolve Bootstrap SCSS imports on Windows

Upstream issue: https://github.com/vercel/next.js/issues/86431

## Steps

```
npm install
npm run build          # next build --turbopack
```

## Expected

Build succeeds (it does on Linux/macOS, and on Windows with `npm run build:webpack`).

## Actual (Windows 10/11, Node 22.x, next 16.0.3)

```
Error: Turbopack build failed with 1 errors:
./src/styles/my-bootstrap.scss
Error evaluating Node.js code
Error: Can't find stylesheet to import.
1753 | @import "variables-dark";
  node_modules\bootstrap\scss\_variables.scss 1753:9  @import
```

Notes:
- `next build --webpack` succeeds on Windows.
- `sassOptions.loadPaths: ["node_modules/bootstrap/scss"]` is the reported workaround.
- `sassOptions.includePaths` has no effect with either bundler in Next 16 (legacy Sass API option).
