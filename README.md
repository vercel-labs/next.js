# Repro: next.js#35110 — `Module parse failed: Cannot use 'import.meta' outside a module`

`next dev --webpack` fails to compile a local (linked / `file:` / yalc) CommonJS package
listed in `transpilePackages` when that package's `package.json` contains `"type": "commonjs"`.
The react-refresh loader appends `import.meta.webpackHot.accept()`, but webpack parses the
file as CommonJS, so `import.meta` is illegal.

## Run

```bash
npm install
npx next dev --webpack   # -> 500, "Cannot use 'import.meta' outside a module"
npx next dev             # Turbopack: works (200)
```

Remove `"type": "commonjs"` from `packages/my-lib/package.json` and the webpack dev build works.
