# next.js#85374 — `output: 'export'` RSC segment files land at a different path than the client requests

Minimal App Router app with `output: 'export'` (no `basePath`), containing a route
group page (`/about` inside `(group)`) and a statically generated dynamic route
(`/hello/[slug]`), both prefetched from `/` via `next/link`.

## What happens

`next build` writes one `.txt` file per RSC segment. The client router requests them
as flat, dot-joined names:

```
/about/__next.!KGdyb3VwKQ.about.__PAGE__.txt?_rsc=...
/hello/foo/__next.hello.$d$slug.__PAGE__.txt?_rsc=...
```

On **Windows** the export step writes them as *nested directories* instead:

```
out/about/__next.!KGdyb3VwKQ/about/__PAGE__.txt
out/hello/foo/__next.hello/$d$slug/__PAGE__.txt
```

so every prefetch 404s. Root cause: `next/dist/export/index.js` builds the segment
path with `path.relative()` (`\`-separated on win32) and
`convertSegmentPathToStaticExportFilename()` only maps `/` to `.`:

```
convertSegmentPathToStaticExportFilename('/page/__PAGE__')  // __next.page.__PAGE__.txt   (posix)
convertSegmentPathToStaticExportFilename('/page\\__PAGE__') // __next.page\__PAGE__.txt   (win32 -> nested dir)
```

## Run (reproduces on any OS)

```bash
npm install
npm run build            # posix build: flat, correct names
npm run emulate-windows  # rewrites out/ into the exact layout a win32 build produces
npm run serve            # http://localhost:3000
```

Open <http://localhost:3000/> with devtools: the `__PAGE__.txt?_rsc=` prefetch
requests return **404**.

On Linux/macOS, skipping `npm run emulate-windows` yields all 200s — the bug is
specific to builds produced on Windows (see vercel/next.js#86948).
