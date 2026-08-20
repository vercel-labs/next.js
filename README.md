# Repro: `TypeError: _formData.get is not a function` in server actions (next dev)

Upstream issue: https://github.com/vercel/next.js/issues/60687

A dependency that imports `isomorphic-form-data` (e.g. `appwrite`, `@twilio/conversations`)
replaces the global `FormData` with the node `form-data` implementation. In `next dev`
that global leaks into server-action request handling, so every server action call
fails, while `next build && next start` works.

## Run

```bash
npm install
npm run dev   # http://localhost:3000 -> click "run server action"
```

Dev: `ERROR: response._formData.data.get is not a function` (POST / 500).
Prod (`npm run build && npm start`): `server action ran`.

Reproduces with Turbopack (default) and with `next dev --webpack`.
