# Reproduction: Dev React debug channel writes to a CLOSED writer (vercel/next.js#97918)

Deterministic harness for issue [#97918](https://github.com/vercel/next.js/issues/97918).
It uses the **real shipped Next.js 16.3.2 modules** on both sides of the React debug
channel, so no HMR race timing is needed:

- server: `next/dist/server/dev/debug-channel.js` → `connectReactDebugChannel`
- client: `next/dist/client/dev/debug-channel.js` → `getOrCreateDebugChannelReadableWriterPair`
- the client call site from `next/dist/client/dev/hot-reloader/app/hot-reloader-app.js:411`
  is reproduced verbatim (`writer.ready.then(() => writer.write(chunk)).catch(console.error)`)

## Run

```bash
npm install
npm run repro           # node harness (real server + client modules)
npm run repro:browser   # Chromium, exact overlay message (installs Playwright chromium first)
```

`npx playwright install chromium` is needed once for the browser check.

## Expected output

`npm run repro`:

```
[ws -> browser] REACT_DEBUG_CHUNK chunk=null (close)
[ws -> browser] REACT_DEBUG_CHUNK chunk=17 bytes
[dev overlay would surface] TypeError [ERR_INVALID_STATE]: Invalid state: WritableStream is closed
REPRODUCED: write to CLOSED writer surfaced via console.error
```

`npm run repro:browser` (Chromium wording, as seen in the dev overlay):

```
{ "readyState": "fulfilled", "error": "TypeError: Cannot write to a CLOSED writable stream" }
REPRODUCED in Chromium
```

## What it shows

1. Server side (`server/dev/debug-channel.js`): in the Node-stream branch, `source.on('error')`
   → `stop()` sends `chunk: null` while the buffered transform still has a pending microtask
   flush. `sendChunk` is **not** gated on `finished`, so a data chunk is sent *after* the close
   signal for the same `requestId`.
2. Client side: the pair map deliberately outlives close, so the late chunk is handed the cached
   **CLOSED** writer.
3. `writer.ready` is *fulfilled* on a closed writer (backpressure, not liveness), so it is not a
   usable guard; `write()` then fails and `.catch(console.error)` surfaces it as an app error in
   the dev overlay.

Unchanged in `16.4.0-canary.8` (`dist/client/dev/hot-reloader/app/hot-reloader-app.js:409`).
