# Repro: `experimental.testProxy` hangs raw TCP sockets (Next.js 16.3.0 regression)

Issue: https://github.com/vercel/next.js/issues/96766

## Run

```bash
pnpm install
node echo-server.js &                                   # TCP echo server on :3901
ENABLE_TEST_PROXY=true pnpm build
ENABLE_TEST_PROXY=true ECHO_PORT=3901 pnpm start &      # next start -p 3900
curl -m 15 http://localhost:3900/api/probe              # hangs on 16.3.0
```

Or run everything: `bash repro.sh`

## Observed (Node 24.17.0, Linux)

| next | ENABLE_TEST_PROXY | result |
| --- | --- | --- |
| 16.2.12 | true | `{"reply":"ping","ms":2}` |
| 16.3.0 | true | hangs; curl exits 28 after timeout; no TCP connection to :3901 (`ss -tnp`) |
| 16.3.0 | false | `{"reply":"ping","ms":5}` |
| 16.3.1-canary.3 | true | hangs |

## Cause pointer

`next/dist/experimental/testmode/httpget.js` applies `ClientRequestInterceptor` from the
bundled `@mswjs/interceptors`. In 16.3.0 that bundle contains a socket interceptor which
patches `net.Socket.prototype.connect` with `predicate() { return true }`, so *all* raw TCP
connections are captured, not just HTTP ones. The 16.2.12 bundle has no `Socket.prototype`
patch (`grep -c "Socket.prototype" node_modules/next/dist/compiled/@mswjs/interceptors/ClientRequest/index.js`
→ 1 on 16.3.0, 0 on 16.2.12).
