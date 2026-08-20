# Repro for vercel/next.js#45478

`copy-webpack-plugin` copies a file from `node_modules` into the Next.js output
directory under `public/` (as suggested by https://stackoverflow.com/a/71887848),
but the file is never served by the dev server or `next start`.

```bash
npm install
npm run dev   # next dev --webpack -p 3002
curl -i http://localhost:3002/copied/package.json   # => 404

npm run build && npm start
curl -i http://localhost:3002/copied/package.json   # => 404
```

The file exists on disk (dev: `.next/dev/public/copied/package.json`,
build: `.next/public/copied/package.json`) but no route serves it.
Only the project-root `public/` directory is served, so `to: '../public/...'`
(which pollutes the source tree) is the current workaround.
