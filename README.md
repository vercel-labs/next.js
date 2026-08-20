# Repro: next.js#16660 — dynamic routes under a symlinked directory 404 in dev

Symlinks are committed in this repo (`pages/symlinktest -> nolink`, `app/asymlink -> anolink`).
If your checkout materialized them as plain files, recreate them:

    rm -f pages/symlinktest app/asymlink
    ln -s nolink pages/symlinktest
    ln -s anolink app/asymlink

## Run

    npm install
    npm run dev   # http://localhost:3000

| URL | Expected | Actual (next 16.3.1 dev, Turbopack and `--webpack`) |
| --- | --- | --- |
| /nolink/123 | Works dynamic | 200 "Works dynamic" |
| /symlinktest/123 | Works dynamic | **404 This page could not be found** |
| /symlinktest | Works index | 200 "Works index" (static route through symlink is fine) |
| /anolink/123 (App Router) | App works dynamic | 200 |
| /asymlink/123 (App Router) | App works dynamic | **404** |

## Extra

* `npm run build -- --webpack && npm start` DOES serve `/symlinktest/123` (200) and lists
  `/symlinktest/[id]` in the route table, so this is a dev-server route-discovery bug.
* `npm run build` (Turbopack, default) fails: `Two or more assets with different content were
  emitted to the same output path` — the symlinked page dir is compiled twice.
