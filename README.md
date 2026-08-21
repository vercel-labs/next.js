# next#76782 — App Router HMR never reconnects after the HMR WebSocket closes (sleep/resume)

Deterministic reproduction of https://github.com/vercel/next.js/issues/76782, based on
https://github.com/rob-myers/next-js-repro. Suspend/resume is emulated so no laptop lid is needed.

## How the sleep is emulated

`suspend-proxy.mjs` is a TCP proxy on `:3100` forwarding to `next dev` on `:3000`. On `SIGUSR2`
it destroys every live socket but keeps listening — exactly what Chrome reports as
`net::ERR_NETWORK_IO_SUSPENDED` after a resume: the HMR WebSocket closes while the dev server
stays alive and new requests succeed.

`hmr-sleep-test.mjs` (Playwright/Chromium) then:

1. loads `http://localhost:3100`, edits `app/page.tsx` → asserts HMR works (baseline);
2. drops the sockets (emulated sleep), waits, verifies plain `fetch('/')` returns 200 (resumed);
3. edits `app/page.tsx` again → asserts whether HMR applies.

## Run

```bash
NEXT_VERSION=15.2.2-canary.0 ./repro.sh   # fails: no HMR after resume
NEXT_VERSION=16.3.1 ./repro.sh            # passes: client reconnects
```

## Observed

| next | baseline HMR | HMR after emulated resume | websocket events |
| --- | --- | --- | --- |
| 15.2.2-canary.0 (webpack, reporter's version) | applied in 509 ms | **never applied (36 s timeout)**, DOM stuck on pre-sleep text | open, close |
| 15.5.4 (webpack) | applied | **never applied** | open, close |
| 16.3.1 (webpack) | applied | applied in ~0.5 s, component state kept | open, close, open |
| 16.3.1-canary.26 (webpack) | applied | applied in ~0.5 s, `[HMR] connected` again | open, close, open |

Cause in the broken versions: `next/dist/client/components/react-dev-overlay/utils/use-websocket.js`
creates the App Router HMR socket with no `onclose`/`onerror` handler, so a single close is terminal.
Current versions (`client/dev/hot-reloader/app/web-socket.js`) attach `handleDisconnect` and re-`init()`
with backoff, which is why the reporter's last comment says `next@canary` fixed it.
