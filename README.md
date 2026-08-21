# Repro: `Invariant: AsyncLocalStorage accessed in runtime where it is not available`

Issue: https://github.com/vercel/next.js/issues/86719 (reporter's linked repo is unrelated/invalid,
so this is a minimal reconstruction of the described custom-server setup).

## Run

```bash
npm install
npm run dev        # node server.js
curl http://localhost:3000/
```

## Result

* next@15.5.5: server starts, first request to `/` crashes the process with
  `Error: Invariant: AsyncLocalStorage accessed in runtime where it is not available`
  at `next/dist/server/app-render/async-local-storage.js:27:72`.
* next@16.x: crashes immediately at `node server.js` startup with the same error.
* Uncommenting the 4 `AsyncLocalStorage` lines at the top of `server.js` fixes it (page renders 200).

## Cause

`utils/handleRedirects.js` (a plain custom-server helper, like the reporter's
`../utils/handleRedirects`) requires `next/headers` at module scope. That pulls in
`app-render/work-async-storage-instance` -> `app-render/async-local-storage`, which snapshots
`globalThis.AsyncLocalStorage` **once** at module evaluation time. `require('next')` does not set
that global; only `next/dist/server/node-environment` (node-environment-baseline) does, and that
runs later inside the server bootstrap. So the storage is permanently the `FakeAsyncLocalStorage`
that throws.

Verified with `node -e "require('next'); typeof globalThis.AsyncLocalStorage" // undefined`.
