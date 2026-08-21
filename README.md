# Repro: `import()` of `.mdx` fails in webpack dev (next/mdx)

Issue: https://github.com/vercel/next.js/issues/77554

```
npm install
npm run dev:webpack   # -> GET / 500, TypeError: Cannot read properties of undefined (...)
```

- Webpack dev (`next dev --webpack`): 500, the MDX module's `react/jsx-dev-runtime`
  namespace is `undefined` inside the lazily-loaded RSC chunk.
- Turbopack dev: works.
- `next build --webpack` + `next start`: works.
- Adding `mdx` to `pageExtensions` in `next.config.mjs` makes webpack dev work too,
  so the failure only happens when `.mdx` is not a page extension.
