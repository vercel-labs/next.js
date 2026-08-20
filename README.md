# next.js#53253 — inaccurate source maps for sources under `node_modules` (webpack)

`vendor-lib/index.js` and `src/lib.js` are **byte-identical**. `vendor-lib` is copied into
`node_modules/` by `postinstall`, both are imported by `pages/index.js`.

```bash
npm install
npm run repro          # next build --webpack + source map fidelity check
npm run build:turbopack && npm run check   # Turbopack: both are high fidelity
```

`scripts/check-maps.mjs` decodes `.next/static/chunks/**/*.js.map` and prints, per source,
the number of mappings, how many point at a non-zero original column, and how many carry
an original name.

Observed on next@16.3.1-canary.25 with `--webpack`:

```
node_modules/vendor-lib/index.js : { mappings: 20,  columnAccurate: 4,   withNames: 0  }
src/lib.js                       : { mappings: 118, columnAccurate: 117, withNames: 68 }
```

The `node_modules` copy only gets line-level mappings and no `names`, so debuggers cannot
resolve original variable names/scopes. The identical file under `src/` gets full
column-level mappings. Turbopack (`next build`) emits high fidelity maps for both.
