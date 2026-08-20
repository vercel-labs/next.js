# Repro for vercel/next.js#58462

`@vercel/ncc build` of a Next.js custom server fails: webpack cannot resolve
`react-dom/server.edge`, `react-dom/static.edge` and `react-dom/server-rendering-stub`,
which `next/dist/server/*` imports unconditionally, but which do not exist in the
`exports` map of react-dom 18.

## Steps

```bash
npm install
npm run build   # succeeds
npm start       # custom server works (Ctrl-C to stop)
npm run package # FAILS
```

## Observed (next 14.0.2 / react-dom 18.2.0, linux, node 24)

```
Module not found: Error: Package path ./server.edge is not exported from package <root>/node_modules/react-dom
Module not found: Error: Package path ./static.edge is not exported from package <root>/node_modules/react-dom
Module not found: Error: Package path ./server-rendering-stub is not exported from package <root>/node_modules/react-dom
```
6 such errors, `ncc` exits 1.

## Also checked

With `next@16.3.1` + `react`/`react-dom@19.2.8` the react-dom export errors are gone
(react 19 exports those paths), but `ncc build` still fails, with an internal
`TypeError: Cannot read properties of undefined (reading 'path')` from ncc/webpack,
so bundling a Next.js custom server with ncc into a single file still does not work.
