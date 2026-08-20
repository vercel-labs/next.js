# Repro: next.js#66572

CJS package in `node_modules` used from a Client Component: the
`typeof window === 'undefined'` branch is not eliminated in the app-router browser
layer, so webpack follows `require('undici')` and fails on `node:` imports.

## Run

```bash
npm install          # .npmrc sets install-links=true so @test/cjs-module is copied into node_modules
npx next build --webpack        # fails: UnhandledSchemeError: Reading from "node:crypto"/"node:assert"
npx next dev --webpack         # then open http://localhost:3000/cjs -> 500 build error
```

- `/cjs` uses `@test/cjs-module` from `node_modules` -> build error.
- `/local` uses byte-identical code under `app/local/_lib` -> works (200), `undici` is dropped.
- Adding `transpilePackages: ['@test/cjs-module']` does NOT help.
- Turbopack (`npx next dev`) does not error.

Cause: `next/dist/build/swc/options.js` deletes `jsc.transform.optimizer.globals.typeofs.window`
for node_modules in the app browser layer, so the dead server branch survives.
