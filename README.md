# Repro: draftMode() broken in Node.js runtime middleware / proxy

https://github.com/vercel/next.js/issues/82344

```bash
npm install
npm run dev
```

Steps:

1. `curl -si -c c.txt http://localhost:3000/api/preview` — sets the
   `__prerender_bypass` cookie (draft mode enabled).
2. `curl -si -b c.txt http://localhost:3000/` — response header is
   `x-draft-mode: disabled`, while the page itself renders
   `page draftMode().isEnabled: true`.
3. `curl -si "http://localhost:3000/?draft=true"` — 500 with
   `Invariant: previewProps missing previewModeId this should never happen`.

Cause: middleware/proxy resolves preview props via
`getEdgePreviewProps()` (`next/dist/server/web/get-edge-preview-props.js`),
which reads `process.env.__NEXT_PREVIEW_MODE_ID`. Those env vars are only
injected into the edge sandbox, so in the Node.js runtime they are
`undefined` (see the logged values), giving an empty `previewModeId`.

Removing `export const runtime = 'nodejs'` (Next 15 `middleware.ts`) makes it
work, since the edge sandbox defines those variables.
