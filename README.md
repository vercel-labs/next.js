# Repro: issue #46267 — `next build` and Node subpath export patterns (`"./*"`)

A local workspace package `my-lib` exposes wildcard subpath exports:

```json
"exports": { "./*": { "types": "./dist/subpath/*.d.ts", "import": "./dist/subpath/*.js" } }
```

`app/page.tsx` does `import { hello } from 'my-lib/hello'`.

## Current canary (passes)

```bash
npm install
npx next build          # turbopack
npx next build --webpack
npx next dev            # renders "hello from subpath"
```

Next generates/forces `"moduleResolution": "bundler"` in `tsconfig.json`, so `tsc`
resolves the wildcard `exports` and the build succeeds. Setting `moduleResolution: "node"`
manually is rewritten back to `bundler` by `next build`.

## Original failure (Next 13.1.x)

```bash
cd legacy-next-13
npm install --legacy-peer-deps
npx next build
# Type error: Cannot find module 'my-lib/hello' or its corresponding type declarations.
```

Next 13 scaffolded `"moduleResolution": "node"` (node10), which ignores the `exports`
field entirely — webpack/dev resolved the subpath, the type check did not.
