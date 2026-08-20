# Repro: vercel/next.js#58805 — fully specified `.js` imports fail to resolve in TS projects

tsconfig has `"module": "esnext"`, `"moduleResolution": "bundler"`.
`pages/index.tsx` imports `../components/Foo.js` (file on disk is `components/Foo.tsx`).

```
npm install
npx next build            # Turbopack (default): Module not found: Can't resolve '../components/Foo.js'
npx next build --webpack  # webpack: Failed to compile, same error
```

Documented workaround (`experimental.extensionAlias`) fixes only the webpack build; the
default Turbopack build still fails with it configured:

```js
// next.config.js
module.exports = { experimental: { extensionAlias: { '.js': ['.ts', '.tsx', '.js', '.jsx'] } } }
```
