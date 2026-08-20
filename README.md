# Reproduction for vercel/next.js#45659

`main-app-[hash].js` (app router) gets a different content hash when the very same
project is built from a different absolute path, even with a pinned
`generateBuildId`. Every other chunk hash stays identical.

## Run

```bash
npm install
npm run repro
```

The script copies this project into two temp directories and runs
`next build --webpack` in each.

## Observed (next@16.3.1-canary.25, webpack)

```
dir A: main-app-64da00e265656d1c.js
dir B: main-app-cf9620811b662f94.js
```

All other chunks (`main-*`, `framework-*`, `webpack-*`, `polyfills-*`, `794-*`,
`4bd1b696-*`) are byte-identical. The only difference inside `main-app-*.js` is
the webpack module id of the app client entry (e.g. `2793` vs `5847`), which is
derived from the absolute project path, so the file contents – and therefore the
hash – change per directory.

Also reproduced with next@14.2.4 and next@15.5.4 (webpack). Turbopack builds
(`next build` on Next 16) produce identical chunk names across directories.
