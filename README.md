# Repro for vercel/next.js#80186 — `require.resolve()` returns bundler module ids on the server

`require.resolve()` inside a server-only route/Server Action returns a Turbopack/webpack
*module id* (e.g. `[project]/node_modules/highlight.js/lib/index.js [app-route] (ecmascript)`)
instead of a real filesystem path. Libraries that resolve their own asset files
(`md-to-pdf` -> `markdown.css`, `highlight.js` styles) then read a bogus path and fail with ENOENT.

## Run

```bash
npm install
npm run dev          # Turbopack
# or: npm run dev:webpack
curl http://localhost:3000/api/resolve
```

## Observed (next 16.3.1, `next dev --turbopack`)

```json
{
  "require.resolve(highlight.js)": "[project]/node_modules/highlight.js/lib/index.js [app-route] (ecmascript)",
  "cssPath": "<cwd>/[project]/node_modules/highlight.js/styles/default.css",
  "existsSync": false,
  "readError": { "code": "ENOENT", "syscall": "open", "path": "<cwd>/[project]/node_modules/highlight.js/styles/default.css" }
}
```

Also reproduced with:
- next 15.2.4 (version in the report), Turbopack dev — identical `[project]/...` id.
- webpack dev (`npm run dev:webpack`) — id is `(rsc)/./node_modules/highlight.js/lib/index.js`.
- `serverExternalPackages: ['highlight.js']` — does not help; id becomes
  `[externals]/highlight.js [external] (highlight.js, cjs, [project]/node_modules/highlight.js)`.
- `next build && next start` (16.3.1) — route returns 500 with
  `TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string. Received type number`,
  because `require.resolve()` returns a numeric module id.

Expected: `require.resolve()` in server code returns a real absolute filesystem path
(as plain Node.js does).
