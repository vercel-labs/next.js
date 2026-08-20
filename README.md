# Repro: `modularizeImports` cannot map one barrel to multiple directories (#52462)

Local package `@some/library` has a barrel `dist/index.js` re-exporting from
`dist/components/`, `dist/hooks/` and `dist/utils/`.

## Reproduce the failure

`next.config.js` (checked in) uses the pattern the reporter hoped for:

```js
modularizeImports: {
  '@some/library': { transform: '@some/library/dist/(components|hooks|utils)/{{member}}' },
}
```

```bash
npm install
npx next build
```

Fails with three `Module not found: Can't resolve
'@some/library/dist/(components|hooks|utils)/<member>'` errors: the transform
template is a literal path (handlebars), so `(a|b|c)` alternation is emitted
verbatim and never resolved.

## Working alternative

```bash
cp next.config.workaround.js next.config.js && npx next build   # succeeds
```

which uses `experimental.optimizePackageImports: ['@some/library']` instead.
