# Reproduction: `optimizePackageImports` does not tree-shake `react-icons` in dev

Upstream issue: https://github.com/vercel/next.js/issues/70666

`app/page.tsx` imports exactly one icon from each of `react-icons/fa`, `react-icons/bs`,
`react-icons/ai` plus one `lucide-react` icon. `next.config.mjs` lists `react-icons` and its
subpaths in `experimental.optimizePackageImports`.

## Run

```bash
npm install
npm run dev            # Turbopack dev
# in another shell:
curl -s http://localhost:3000 > /dev/null
npm run measure
```

Repeat with `npm run dev:webpack` for the webpack dev server.

## Observed (Next.js 16.3.1)

| mode | react-icons in dev bundle | lucide-react (1 icon) |
| --- | --- | --- |
| Turbopack dev, client chunks | ~5.9 MB (whole fa+bs+ai packs) | ~29 KB |
| webpack dev | `.next/dev/static/chunks/app/page.js` = 13.4 MB, `server/vendor-chunks/react-icons.js` = 12.9 MB | `vendor-chunks/lucide-react.js` = 33 KB |
| production build (`npm run build`) | total client JS 572 KB | – |

`lucide-react` (also handled by `optimizePackageImports`) is tree-shaken in dev, `react-icons` is not.

Root cause hint: `react-icons/<pack>/index.mjs` is a single ~1.4 MB module that defines every
icon inline; it is not a barrel of re-exports, so the barrel-file rewrite performed by
`optimizePackageImports` has nothing to rewrite and dev (no minifier / no tree-shaking) keeps the
whole pack.
