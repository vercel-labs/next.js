# Repro: static export emits metadata images without a file extension (#82177)

`output: 'export'` writes the generated Open Graph image to `out/opengraph-image`
(no `.png` extension), so extension-based static hosts (GitHub Pages, `serve`, S3,
Vercel static) cannot infer the MIME type and send it as `application/octet-stream`.
`next dev` serves the same route as `image/png`.

## Run

```bash
npm install
npm run build
ls out                       # -> out/opengraph-image  (expected: out/opengraph-image.png)
npx --yes serve@14 out -p 3000
curl -I http://localhost:3000/opengraph-image   # no Content-Type: image/png
```

Reproduced with next 15.4.4 and next@canary (16.3.1-canary.26).
