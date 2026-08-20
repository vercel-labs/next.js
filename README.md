# Repro: Next.js ships syntax Safari 12 / iOS 12 cannot parse (vercel/next.js#48627)

`scan.mjs` fetches every `<script src>` of a page served by a running Next.js
server and parses it with acorn at `ecmaVersion: 2019`, the newest ECMAScript
level Safari 12 / iOS 12 fully supports. Any file that fails to parse is a file
Safari 12 rejects with `SyntaxError: Unexpected token '.'` (optional chaining)
or similar.

## Run

```bash
npm install

# dev
npm run dev &        # wait for "Ready"
npm run scan:dev

# production
npm run build
npm start &
npm run scan:prod
```

Exit code is non-zero when any served script uses post-ES2019 syntax.

## Observed with next@16.3.1-canary.25 (Node 24, Turbopack default)

* dev: 9 / 19 served scripts fail. Includes the pre-compiled dev overlay bundle
  `node_modules_next_dist_compiled_*.js` (`t?.shadowRoot`) — the exact failure
  in the issue — plus `??` in the Turbopack HMR runtime and `next/dist/client`.
* production `next build` + `next start`: 3 / 7 scripts fail — `??` in
  `next/dist/client/page-bootstrap` output and **ES2022 class `static {}`
  blocks** in the pages runtime chunk, so this is not dev-only.
* Adding `"browserslist": ["safari 12", "ios_saf 12"]` makes the production
  build clean (0 / 7), but dev still fails: the pre-compiled overlay bundle keeps
  `?.` and the Turbopack chunk runtime keeps ES2021 numeric separators (`20_000`).
