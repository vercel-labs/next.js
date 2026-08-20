# Repro: `output: 'standalone'` copies no dependencies under Yarn PnP (vercel/next.js#50072)

Minimal Pages Router app, Next.js `16.3.1-canary.25`, Yarn 4 with the default
PnP linker (no `nodeLinker: node-modules`).

## Run

```bash
corepack enable
yarn install
NEXT_TELEMETRY_DISABLED=1 yarn build --webpack   # standalone output
node .next/standalone/server.js
```

## Observed

`.next/standalone/` contains only `server.js`, `package.json` and `.next/`
— no `node_modules` at all — so the server crashes:

```
Error: Cannot find module 'next'
Require stack:
- .../.next/standalone/server.js
```

With `enableGlobalCache: false` (Yarn 3 default), `.next/standalone/.yarn/cache/`
receives only two zips (`next`, `styled-jsx`) and no `.pnp.cjs`, so the output is
still not runnable — this is the `Cannot find module 'styled-jsx'` variant in the issue.

## Expected

Standalone output is self-contained and `node server.js` boots.

## Notes

- The same app installed with pnpm or npm produces a working
  `.next/standalone/node_modules` and boots fine (HTTP 200).
- Turbopack (the default builder in Next 16) cannot build a PnP project at all:
  `Error: Could not find the Next.js package (next/package.json)`, hence `--webpack`.
