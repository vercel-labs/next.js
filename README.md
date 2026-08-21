# Repro: next#84912 — Turbopack "not chunkable" module in async chunking

Minimal reproduction of https://github.com/vercel/next.js/issues/84912 on Next.js 16.3.1-canary.26.

`app/page.tsx` does a dynamic import with a template literal:

```ts
const mod = await import(`../themes/theme-${themeName}`)
```

Turbopack expands this into a context module over `themes/theme-*/**`. That glob also
matches the `.css` files inside those folders, and CSS assets are not chunkable in an
ESM/async chunk, so compilation fails.

## Run

```bash
npm install
npm run build   # TurbopackInternalError: expected chunkable module for async reference
# or
npm run dev     # then: curl http://localhost:3000/  -> 500
```

## Observed

`next build`:

```
Error [TurbopackInternalError]: Failed to write app endpoint /page
Caused by:
- expected chunkable module for async reference
...
- Execution of get_global_module_id_strategy failed
- expected chunkable module for async reference
```

`next dev` (HTTP 500):

```
./app/page.tsx
Error: non-ecmascript placeable asset
[project]/themes/theme-one/theme-one.css [app-client] (css, css client reference) is not
placeable in ESM chunks, so it doesn't have a module id and can't be imported here.
```

On the reporter's original version (next 16.0.0-canary.6) the same setup panics with
`FATAL ... Module in async chunking edge is not chunkable`.

## Isolation

Moving the two `.css` files out of `themes/theme-*/` (so the glob no longer matches them)
makes the page render 200 — the `import './theme-x.css'` statement itself is not required;
merely having a CSS file matching the dynamic-import glob is enough to break the build.
