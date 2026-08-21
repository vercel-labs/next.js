# Repro for vercel/next.js#78954 — docs custom server lacks error handling

`server.js` is copied verbatim from https://nextjs.org/docs/app/guides/custom-server
(Next.js 16.3.1).

## Run

```bash
npm install
npm run build
# terminal 1: occupy the port
NODE_ENV=production node server.js
# terminal 2: run the documented example again on the same port
NODE_ENV=production node server.js
```

Observed with next@16.3.1 / node v24.17.0: the second process dies with
`⨯ uncaughtException: Error: listen EADDRINUSE: address already in use :::3000`
because the documented example attaches no `.on('error', ...)` handler to the
`http.Server`, so any `listen`/socket error is an unhandled `'error'` event.

## Promise-rejection part of the report (not reproducible)

`npm run probe` calls `handle(req, res, <invalid parsed url>)` and logs the
returned value. The handler returns a Promise that **resolves** after serving a
500 (`TypeError: Invalid URL` is logged by Next.js internally), i.e. no
unhandled rejection was observed; adding `.catch()` is defensive only.
