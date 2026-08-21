# Repro: next.js#77796

`opengraph-image.tsx` with `export const runtime = 'nodejs'` is still bundled into the
**Edge** server-component graph of its sibling `page.tsx` (`export const runtime = 'edge'`),
so its Node.js-only imports (`node:fs/promises`, `node:path`, `process.cwd()`) break the page.

## Steps

```bash
npm install

# webpack (fully broken)
npm run dev:webpack        # GET / -> 500, GET /opengraph-image -> 500
npm run build:webpack      # exits 1: UnhandledSchemeError: Reading from "node:fs/promises"

# turbopack (renders, but still logs the edge-bundling error)
npm run dev                # GET / -> 200, but "Failed to load external module node:fs/promises:
                           # TypeError: Native module not found" is logged for
                           # Edge Server Component -> ./app/opengraph-image.tsx
npm run build              # exits 0 with the same edge-graph warnings
```

Verified with next@16.3.1, node v24.

The import trace always points at
`./app/opengraph-image.tsx -> ./app/opengraph-image--metadata.js` inside the
`Edge Server Component` / `app/page.tsx?__next_edge_ssr_entry__` graph, i.e. the
per-file `runtime = 'nodejs'` export of the image route is ignored when the image
metadata module is pulled into the edge page entry.
