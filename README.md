# Repro: `uncaughtException: Error: aborted` (ECONNRESET) when middleware is present

Reproduction for https://github.com/vercel/next.js/issues/49587
(same root cause as https://github.com/vercel/next.js/issues/84649).

The original report used nginx + `proxy_intercept_errors` + a custom server to make the
client drop the connection. nginx is not needed: aborting the socket right after the
request body is written is enough, as long as `middleware.js` exists and the target route
is being compiled for the first time.

## Setup

```bash
npm install
```

## Reproduce (next dev)

```bash
npm run dev            # terminal 1  (plain `next dev`)
node abort-request.cjs /api/r1   # terminal 2, one fresh route per attempt
```

Each aborted request logs an uncaught exception in the server terminal:

```
 ⨯ uncaughtException: Error: aborted
   ... code: 'ECONNRESET'
```

Use a different, not-yet-compiled route (`/api/r2`, `/api/r3`, ...) for each attempt;
the crash happens while the route is compiled for the first time.

## Reproduce with the custom server from the issue

```bash
npm run dev:custom-server        # express custom server, dev mode
node abort-request.cjs /api/r2
```

The custom server's own `process.on('uncaughtException')` handler receives the error
("Uncaught Exception log : Error: aborted"), which is what crashes apps that re-throw or
exit in that handler.

## Control

Delete or rename `middleware.js` and repeat: no uncaught exception is logged.
