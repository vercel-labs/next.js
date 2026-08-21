# Repro for vercel/next.js#75635

App Router route handler importing `llamaindex@0.8.31`.

- `next@14.2.16`: `next build` compiles; traced server output ~13 MB (`.next/server`).
- `next@14.2.17` .. `14.2.23`: `next build` fails with `Module parse failed` on
  `node_modules/onnxruntime-node/bin/napi-v3/**/onnxruntime_binding.node`, because the
  `next-server-binary-loader` webpack rule for `.node` files on the Node.js server was
  removed after 14.2.16 (see `dist/build/webpack-config.js`).

## Run

```
npm install
npx next build            # fails on 14.2.23
npm i next@14.2.16 && npx next build   # succeeds
node measure.js           # sums unique files from .next/**/*.nft.json
```
