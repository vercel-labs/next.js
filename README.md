# Repro: `experimental.testProxy` breaks outgoing requests with an `expect` header (vercel/next.js#82913)

Minimal, credential-free version of the reporter's AWS-S3 repro.

`experimental.testProxy` installs the `@mswjs/interceptors` ClientRequest interceptor
(`next/dist/experimental/testmode/httpget.js`), so *every* `http.request` from server code is
re-issued through undici `fetch`. undici rejects an `expect` header
(`NotSupportedError: expect header not supported`), so requests such as the AWS S3 SDK's
`expect: 100-continue` PUT fail even when no Playwright/test proxy is attached.

## Run

```bash
npm install
node echo-server.js &            # plain HTTP echo server on 127.0.0.1:4001

# broken
USE_TEST_PROXY=1 npm run dev
curl localhost:3000/api/expect
# -> {"ok":true,"status":500,"body":"{\"name\":\"TypeError\",\"message\":\"fetch failed\",...}"}
#    (the intercepted request never reaches the echo server)

# control
USE_TEST_PROXY=0 npm run dev
curl localhost:3000/api/expect
# -> {"ok":true,"status":200,"body":"echo:hello"}
```

Also reproduces with `USE_TEST_PROXY=1 npm run build && USE_TEST_PROXY=1 npm start`.

Verified on next@16.3.1-canary.26, Node 24.17.0 (reported on 15.5.1-canary.3).
