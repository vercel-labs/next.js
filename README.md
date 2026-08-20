# Repro: Turbopack loader item options type too strict (vercel/next.js#74336)

`turbopack.rules[].loaders[].options` is typed as `Record<string, JSONValue>`, which
rejects loader option types that are not index-signature-compatible (e.g. `@svgr/core`'s
`Config`), even though the options work fine at runtime.

## Run

```
npm install
npm run typecheck   # TS2322: Type 'Config' is not assignable to type 'TurbopackLoaderOptions'.
npm run dev         # works: the SVG is transformed by @svgr/webpack
```
