# next#98212 — dev HMR client reconnects forever after prerender activation

Reproduction for https://github.com/vercel/next.js/issues/98212 on
`next@16.4.0-canary.15` (also confirmed on `16.3.3`), App Router + Turbopack, `next dev`.

When Chrome activates a document it prerendered via Speculation Rules,
`visibilitychange` fires while the first `/_next/hmr` WebSocket is still
`CONNECTING`. `handleVisibilityChange` in
`packages/next/src/client/dev/hot-reloader/app/web-socket.ts` reconnects whenever
`readyState !== OPEN`, and `init()` closes the previous socket without detaching
its `onclose`/`onerror`, so the old socket's `handleDisconnect` schedules another
`init()` 1s later, which kills the new socket, forever. `reconnections` is reset
on every `onopen`, so `WEB_SOCKET_MAX_RECONNECTIONS` never trips.

## Run

```bash
npm install
npm run dev            # custom server: next() + explicit upgrade handling, logs every /_next/hmr upgrade
```

Then, in Chrome, open http://localhost:3000/?auto (it navigates to the
prerendered `/target` after 2.5s), or open http://localhost:3000/ and click the
link after a second. Watch the dev server output.

Automated (no DevTools client — see note below):

```bash
CHROME_PATH="/path/to/chrome" npm run check              # prerender-activated load  -> FAILS
CHROME_PATH="/path/to/chrome" npm run check -- control   # direct load of /target    -> ok
```

`scripts/check.mjs` boots the server, launches headless Chrome at the URL, watches
for 25s and exits non-zero when more than two `/_next/hmr` upgrades arrive.

## Observed

```
[check] mode=prerender: 22 /_next/hmr upgrade(s)     # ~1 per second, same ?id=, never stops
[check] mode=control:    1 /_next/hmr upgrade(s)
```

Browser console on the broken page: `WebSocket connection to
'ws://localhost:3000/_next/hmr?id=…' failed: WebSocket is closed before the
connection is established`, then `[HMR] connected` again every second.
`performance.getEntriesByType('navigation')[0].activationStart > 0`.

With the fix from the issue applied to
`node_modules/next/dist/client/dev/hot-reloader/app/web-socket.js`
(detach `onclose`/`onerror` before `close()`, and only reconnect on
`readyState === WebSocket.CLOSED`), the same run reports 2 upgrades total
(one per document) and no loop.

## Note on DevTools / CDP

Chrome refuses to prerender while a DevTools or CDP client is attached
(`Preload.prerenderStatusUpdated` reports `PrerenderingDisabledByDevTools`, even
after `Page.setPrerenderingAllowed`), so Playwright/CDP-based checks silently see
the non-prerendered path. This repro therefore runs Chrome with no debugging port
and collects evidence server-side.
