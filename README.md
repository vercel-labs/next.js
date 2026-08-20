# Reproduction for vercel/next.js#37142 — duplicated compiled helpers in client bundle

Minimal pages-router app (one page returning `<h1>Hello</h1>`).

```bash
npm install
npm run build          # Turbopack (default)
node scan.mjs
npm run build:webpack  # webpack
node scan.mjs
```

`scan.mjs` counts occurrences of the compiled-helper patterns quoted in the issue
inside `.next/static/chunks/**/*.js`.

Result on next@16.3.1-canary.25 (Node 24):

| pattern | Turbopack | webpack |
| --- | --- | --- |
| class / inherits / destructure / spread helpers | 0 | 0 |
| CJS default-export interop epilogue | 39 copies in 5 chunks (~8.3 kB) | 37 copies in main.js (~7.9 kB) |
| namespace-import interop loop | 1-2 | 2 |

So the Babel-style transpilation helpers from the original report are gone, but the
`Object.defineProperty(x.default,"__esModule",{value:!0}),Object.assign(x.default,x),module.exports=x.default`
epilogue is still inlined once per Next.js CJS module instead of shared.
