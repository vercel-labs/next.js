# Repro harness for vercel/next.js#88736

`next dev` under bun reportedly hangs when started from VS Code's **JavaScript Debug
Terminal** (macOS, bun 1.3.x, `bun --bun next dev`, Next 16.1).

`app/` is the reporter's app (https://github.com/Aokoooooo/dev-bun-next, commit
d1ee206b5b63c5e394b06132e13d49149b68963a).

`harness/dap-client.mjs` + `run.sh` recreate the JS Debug Terminal without VS Code:
a standalone `vscode-js-debug` DAP server (v1.117.0) is launched, and the reverse
`runInTerminal` request is answered by spawning `bun run dev` with exactly the env
js-debug injects:

```
NODE_OPTIONS=" --require <js-debug>/src/bootloader.js  --inspect-publish-uid=http"
VSCODE_INSPECTOR_OPTIONS=":::{\"inspectorIpc\":...,\"deferredMode\":false,\"autoAttachMode\":\"always\",...}"
```

## Run

```bash
./run.sh                 # plain bootloader path
SPACED_PATH=1 ./run.sh   # bootloader under "Visual Studio Code.app/..." (macOS-style path with spaces)
```

## Result on linux-x64 (bun 1.3.6, node 24.17, next 16.1.1-canary.33)

Not reproduced: dev server becomes ready and `GET /` returns 200 in every variant
(plain, spaced bootloader path, `NODE_OPTIONS=--inspect`). bun ignores `--require`
from `NODE_OPTIONS`, so the js-debug bootloader never loads; the forked
`server/lib/start-server.js` child receives
`NODE_OPTIONS=--require=<bootloader> --inspect-publish-uid=http ...` and starts fine.
Please run `./run.sh` on macOS/arm64 to confirm the platform-specific hang.
