# Reproduction: `import.meta.dirname` / `import.meta.filename` are `undefined` (vercel/next.js#60879)

Node.js 20.11+ exposes `import.meta.dirname` and `import.meta.filename`. In Next.js App Router
server components both are `undefined` with Turbopack and with webpack (`import.meta.url` works).

## Run

```bash
npm install
node import-meta.mjs        # Node baseline: real dirname/filename

npm run dev:turbopack       # http://localhost:3010  -> undefined
npm run dev:webpack         # http://localhost:3011  -> undefined
npm run build:turbopack && npx next start --port 3012  # -> undefined
```

The page and the server console print both values.

## Observed (next@16.3.1-canary.25, Node 24.17.0)

```
[node baseline] import.meta.dirname  = /path/to/repro
[app/page.tsx] import.meta.dirname   = undefined
[app/page.tsx] import.meta.filename  = undefined
import.meta.url                      = file:///path/to/repro/app/page.tsx
```

Next.js bundles webpack 5.98.0; the webpack fix (webpack/webpack#20050) shipped in 5.103.0.
The `webpack.DefinePlugin` workaround from the issue does not apply to Turbopack.
