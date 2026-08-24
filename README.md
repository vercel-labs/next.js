# Turbopack: `compiler.define`-folded `typeof` guard keeps the dead import subtree

Reproduction for https://github.com/vercel/next.js/issues/97791.

`fake-sdk` (local package, `sideEffects: false`) guards an import behind the universal
SDK tree-shaking-flag pattern, with the flag folded away by `compiler.define`:

```js
import { feature } from './feature.js' // ~40 KB dead subtree

if (typeof __MY_FLAG__ === 'undefined' || __MY_FLAG__) {
  integrations.push(feature())
}
```

`next.config.mjs` sets `compiler.define = { __MY_FLAG__: false }`, so the branch is
statically dead. The call site is removed from the emitted code, but the imported module
is kept in the client module graph and emitted.

## Run

```bash
npm install
npm run matrix   # builds 4 times: {typeof guard, plain guard} x {sourcemaps off, on}
```

`run-matrix.mjs` rewrites `fake-sdk/index.js` and `next.config.mjs` for each cell and
greps the emitted client chunks for `FEATURE_MARKER_SHOULD_BE_TREESHAKEN`.

## Result (next@16.4.0-canary.3, also 16.3.2)

| guard | productionBrowserSourceMaps | marker in .js | marker in .map | client js bytes |
|---|---|---|---|---|
| `typeof __FLAG__ === 'undefined' \|\| __FLAG__` | false | **true** | false | 606216 |
| `typeof __FLAG__ === 'undefined' \|\| __FLAG__` | true  | **true** | true  | 605848 |
| `if (__FLAG__)`                                | false | false    | false | 565606 |
| `if (__FLAG__)`                                | true  | false    | false | 565238 |

- The `typeof X === 'undefined' || X` guard leaks ~40 KB of unreachable code into the
  client bundle; the plain `if (X)` guard is pruned.
- `productionBrowserSourceMaps` does **not** change this: the retained byte delta is
  identical (40,610 bytes) with source maps on and off. In the original repro the dead
  subtree was small enough for the minifier to erase, so the only visible trace was
  `sourcesContent` inside `.next/static/chunks/*.js.map`, which made the bug look
  source-map dependent.

Single build check (default config committed here):

```bash
npx next build
grep -rl FEATURE_MARKER_SHOULD_BE_TREESHAKEN .next/static/chunks/
```
