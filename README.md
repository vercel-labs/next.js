# Repro: next dev (webpack) does not serve webpack-emitted assets (#67302)

A webpack plugin emits `myasset/test.txt` via `compilation.hooks.processAssets`.
webpack-dev-server serves such assets; `next dev --webpack` returns 404.

## Run
```
npm install
npm run dev
curl -i http://localhost:3000/myasset/test.txt   # -> HTTP 404
find .next -name test.txt                        # -> .next/dev/myasset/test.txt (asset IS emitted)
```
Verified with next@16.3.1-canary.25, Node 24.
