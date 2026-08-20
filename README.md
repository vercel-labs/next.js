# Repro: `transpilePackages` + pnpm/yarn-linked package -> duplicate React in pages router

Issue: https://github.com/vercel/next.js/issues/50391

## Run

```bash
./setup.sh
cd app && pnpm dev        # next dev --webpack
# open http://localhost:3000 in a browser
```

## Observed (Next.js 16.3.1-canary.24, webpack, pages router)

SSR HTML is correct, but on hydration the browser console shows:

```
Warning: Invalid hook call. ... You might have more than one copy of React in the same app
TypeError: Cannot read properties of null (reading 'useState')
    at exports.useState (webpack-internal:///(pages-dir-browser)/../lib/node_modules/.pnpm/react@19.2.0/node_modules/react/cjs/react.development.js)
    at Provider (webpack-internal:///(pages-dir-browser)/../lib/src/index.js)
```

The client bundle contains a **second** React instance, resolved through the symlink's
realpath (`../lib/node_modules/.pnpm/react@19.2.0/node_modules/react`) instead of the app's
`react`. Workaround: `config.resolve.alias.react = path.resolve(__dirname, 'node_modules/react')`.

## Notes

* `next dev` with Turbopack additionally fails with `Module not found: Can't resolve 'my-lib'`
  for the `pnpm link`ed package.
* Same failure reproduces on Next.js 13.4.4 (the version in the report).
