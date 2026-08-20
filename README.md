# Repro: `reactProductionProfiling: true` ignored by the webpack production build (vercel/next.js#68276)

`reactProductionProfiling: true` in `next.config.mjs` should make the production
client bundle use `react-dom/profiling`, so that React DevTools profiling works
in `next start`. With the webpack builder it is ignored; only the `--profile`
CLI flag works. Turbopack honours the config option.

## Run

```bash
npm install

npm run build:webpack && npm run check     # FAIL: profiling build not bundled
npm run build:turbopack && npm run check   # PASS
npx next build --webpack --profile && npm run check  # PASS (CLI flag workaround)
```

`check-bundle.mjs` greps the emitted client chunks for `treeBaseDuration`, an
identifier that exists only in `react-dom/profiling` (0 occurrences in
`react-dom-client.production.js`, 30+ in `react-dom-profiling.profiling.js`).

You can also verify at runtime after `npm run start`: on a mounted DOM node,
`node[Object.keys(node).find(k => k.startsWith('__reactFiber$'))].treeBaseDuration`
is `undefined` with the plain production build and a number with the profiling build.

## Observed

| next | builder | config option only | `--profile` flag |
| --- | --- | --- | --- |
| 16.1.0 | webpack | not bundled | bundled |
| 16.1.0 | turbopack | bundled | bundled |
| 16.3.1-canary.25 | webpack | bundled | bundled |
| 16.3.1-canary.25 | turbopack | bundled | bundled |

`next@16.2.0` is the first release where `build/webpack-config.js` reads
`config.reactProductionProfiling` (`const reactProductionProfiling = config.reactProductionProfiling ?? false`),
so the reported bug is fixed from 16.2.0 onwards; it reproduces on every release
up to and including 16.1.0 (reported on 15.0.0-canary.88).
