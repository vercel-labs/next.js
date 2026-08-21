# Repro: next.js#75128 — `'use client'` + `export *` fails in an ESM library (webpack)

A local package `foo` (`"type": "module"`) has a `'use client'` barrel that does `export * from './Foo'`.
Building/serving with webpack fails; Turbopack works. The same code in project user code (`src/components/index.js`,
parsed as `javascript/auto`) works.

## Run

```bash
npm install
npx next build --webpack   # ❌ Error: It's currently unsupported to use "export *" in a client boundary.
npx next dev  --webpack    # ❌ same error on GET /
npx next build             # ✅ Turbopack: succeeds
```

Toggle the imports in `app/layout.js` to compare with the user-code variant (works).

## Result on next@16.3.1-canary.25

| case | webpack | turbopack |
| --- | --- | --- |
| `import { Foo } from 'foo'` (package `type: module`, `export *`) | error | ok |
| same barrel as user code `.mjs` | error | ok |
| same barrel as user code `.js` | ok | ok |

Trigger is the module being parsed as ESM (`javascript/esm`): `next-flight-loader` throws when
`assumedSourceType === 'module'` and the client refs include `*`
(`next/dist/build/webpack/loaders/next-flight-loader/index.js`).
