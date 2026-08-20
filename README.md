# Repro: `Module not found: Can't resolve 'react'` for a linked local library with react as peerDependency

Issue: https://github.com/vercel/next.js/issues/20266

Minimal, dependency-light re-creation of https://github.com/TeemuKoivisto/nextjs-react-not-found
(prebuilt `local-module/dist` instead of running rollup).

## Run

```bash
./setup.sh
# or dev server:
cd nextjs-app && npm install && ln -s ../../local-module node_modules/local-module
npx next dev --webpack -p 4040   # GET http://localhost:4040/ -> HTTP 500
```

## Layout

- `local-module/` – package living **outside** the app, with `react`/`react-dom` as peerDependencies only and no `node_modules`.
- `nextjs-app/` – Next.js app with react/react-dom installed; `node_modules/local-module` is a **symlink** to `../../local-module` (what `yarn link` / `npm link` produces).

## Observed (Next.js 16.3.1-canary.25, Node 24)

webpack (`next build --webpack`):

```
../local-module/dist/index.es.js
Module not found: Can't resolve 'react'
Import trace for requested module:
./pages/index.js
```

`next dev --webpack` serves `/` with HTTP 500 and the same error.

Turbopack (default) fails earlier and differently:

```
./pages/index.js:1:1
Module not found: Can't resolve 'local-module'
```

## Expected

`react` should resolve from the consuming app's `node_modules` (as CRA / Vite / plain webpack do).
The bundlers resolve the symlink to its real path outside the app and then only search upward from
`/local-module`, where no `react` exists.
