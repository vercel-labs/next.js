# Minimal repro for vercel/next.js#95637

`NextRouter was not mounted` (500) when a **webpack** production build is served through the
documented programmatic custom-server API (`next({ dev: false })`), if `useRouter()` is called
from an **external** (non-bundled, `node_modules`) component rendered inside `pages/_app`.

No `next-translate`, no `i18n` config, no `output: 'standalone'` needed.

## Run

```bash
npm install
npm run build          # next build --webpack
npm run start:custom   # NODE_ENV=production node server.js
curl -i http://localhost:3000/     # => 500 "NextRouter was not mounted"

npm run start:next     # same build via `next start`
curl -i http://localhost:3000/     # => 200
```

## Matrix (observed, next 16.2.10 / react 19.2.6 / node 24)

| build | server | result |
|---|---|---|
| `next build --webpack` | `node server.js` (custom) | **500 NextRouter was not mounted** |
| `next build --webpack` | `next start` | 200 |
| `next build` (Turbopack) | `node server.js` (custom) | 200 |

The `useRouter()` call must come from a package that webpack leaves external in the server build
(here `vendor/router-wrapper`, copied into `node_modules` by `setup.js` on postinstall); an inline component in `_app` is bundled and does not trigger it.
