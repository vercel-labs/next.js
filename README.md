# Repro: vercel/next.js#62521

`output: 'standalone'` writes a **CommonJS** `server.js` for a `"type": "module"`
project whenever the built directory / `distDir` is one level deeper than the
project root, and it also fails to copy the project `package.json` into the
standalone output.

Verified with **next@16.3.1**, Node 24.

```bash
npm install
npm run repro
```

## Observed (next 16.3.1)

* `next build custom-dir` -> `custom-dir/.next/standalone/custom-dir/server.js`
  starts with `const path = require('path')` and no `package.json` is emitted
  next to it. Copying the standalone folder out and running it fails with
  `ReferenceError: require is not defined in ES module scope`.
* `distDir: 'dist/ephemeral'` (root project) -> same CommonJS output.
* Control: plain `next build` with default `.next` -> `server.js` starts with
  `import path from 'node:path'` and `package.json` is copied.

## Cause

`packages/next/src/build/utils.ts` (`copyTracedFiles`) looks for the project
`package.json` at `path.join(distDir, '../package.json')`, which only resolves
when `distDir` is a direct child of the project root.
