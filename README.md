# Reproduction for vercel/next.js#67623

`next/image` resizes correctly in `next dev` but returns the **original,
unresized** image in a production `output: 'standalone'` deployment (Docker).

Root cause reproduced here: `next build` traces only the *host* platform sharp
binary into `.next/standalone/node_modules/@img` (`sharp-linux-x64` +
`sharp-libvips-linux-x64`). If the runtime platform differs (glibc build ->
`node:*-alpine`/musl runtime, or an install without the matching optional
dependency), `require('sharp')` throws and the image optimizer falls back to the
original file with HTTP 200. The real sharp load error is not surfaced.

## Run

```bash
npm install
npm run repro
```

## Observed (Next.js 14.2.3 and 16.3.1)

- `/_next/image?url=/big.jpg&w=640&q=75` -> 200, 14332 bytes, image is 2000x1200
  (the original) instead of 640x384.
- With the sharp binary present the same request returns 640x384 (~1-2 kB).
- 14.2.3 logs only `'sharp' is required to be installed in standalone mode ...`;
  16.3.1 logs nothing at all.
