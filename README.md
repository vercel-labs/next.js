# Repro: Turbopack file tracing omits `pino/lib/transport-stream.js` (next#87342)

Turbopack's production build trace includes `pino/lib/worker.js` but not the
`./transport-stream` module it requires, so any trace-based deployment
(Vercel Lambda, `output: "standalone"`, Docker) crashes at runtime.
The webpack build traces the file correctly.

## Run

```bash
pnpm install

# Turbopack (default in Next 16) -> FAILS
pnpm build
find .next/standalone -name 'transport-stream.js'   # prints nothing
cd .next/standalone && mkdir -p .next && cp -r ../static .next/static
PORT=3001 node server.js &
curl http://localhost:3001/api/log
```

Server log:

```
Error: Cannot find module './transport-stream'
Require stack:
- .../node_modules/.pnpm/pino@10.1.0/node_modules/pino/lib/worker.js
⨯ uncaughtException:  Error: the worker has exited
```

The HTTP response is still `{"message":"ok"}`; the failure only appears in the
server log (the worker dies, logs are silently lost).

```bash
# webpack -> WORKS
rm -rf .next && pnpm next build --webpack
find .next/standalone -name 'transport-stream.js'   # file is present
cd .next/standalone && mkdir -p .next && cp -r ../static .next/static
PORT=3002 node server.js &
curl http://localhost:3002/api/log                  # no error in the log
```

`output: "standalone"` is used only to materialize the same file trace Vercel
uses to build the Lambda; the underlying miss is visible directly in
`.next/server/app/api/log/route.js.nft.json`.

Verified with next 16.1.0 and 16.3.1 (on 16.3.1 the trace is still missing the
file; standalone additionally fails earlier on a separate `@swc/helpers` trace
miss, so use 16.1.0 to observe the pino error at runtime).
