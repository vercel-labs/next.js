# Reproduction — vercel/next.js#54935

`dynamic()` used inside a **Server Component / page** does not create a lazily-loaded
chunk for the Client Components underneath it: every client component reachable from the
route is preloaded on first load, even when it is not rendered.

## Run

```bash
npm install          # next@canary
npm run build        # Turbopack (default). `npm run build:webpack` for webpack
npm start            # http://localhost:3000
```

Then compare the `<script>`/preload chunks of:

- `/server/a` — page `dynamic()`-imports `ServerComponentA` and `ServerComponentB`
  (only A is rendered) → **both** `ClientComponentA` and `ClientComponentB` chunks
  (~152 kB each) are loaded.
- `/client/a` — same components, but `dynamic()` lives inside a Client Component wrapper
  → only the `ClientComponentA` chunk is loaded (expected behaviour).

Quick check:

```bash
curl -s localhost:3000/server/a | grep -o '/_next/static/chunks/[^"]*\.js' | sort -u \
  | while read u; do curl -s localhost:3000$u | grep -o 'CLIENT_COMPONENT_._MARKER' | sort -u; done
```

`/server/a` prints both `CLIENT_COMPONENT_A_MARKER` and `CLIENT_COMPONENT_B_MARKER`;
`/client/a` prints only `CLIENT_COMPONENT_A_MARKER`.

Each client component is a large unique SVG so its chunk is easy to identify by size.
