# next#86835 — Chrome DevTools "Search in sources" hangs on `next dev` (Next 16)

Minimal `create-next-app` app + a probe that shows *why* the hang is loopback-only.

## Repro

```bash
npm install
npm run dev          # shell 1
node scripts/devtools-workspace-probe.mjs   # shell 2 (needs a display; use `xvfb-run -a` on Linux)
```

Manual repro: open `http://localhost:3000`, open Chrome DevTools, press Cmd/Ctrl+Shift+F, search anything.

## What happens

`next dev` (Next >= 16) serves `/.well-known/appspecific/com.chrome.devtools.json`
(`next/dist/server/lib/chrome-devtools-workspace.js`) with `root` = the project directory,
with no exclusions. Chrome requests that file **only for loopback origins**, so DevTools
auto-connects the whole project folder — `node_modules` (~360 MB / ~9.4k files in this bare app)
and `.next` included — as a Workspace, and `Cmd+Shift+F` searches every file in it.

* loopback (`localhost` / `127.0.0.1`): endpoint requested → workspace connected → search hangs
* LAN IP (`192.168.x.x`): endpoint never requested → no workspace → search returns instantly
* Next 15.3.5: endpoint does not exist → no hang. Firefox: no such feature → no hang.
