# Reproduction attempt for vercel/next.js#74488

Claim in the issue: the `with-docker` example Dockerfile (which lacks
`ENV HOSTNAME="0.0.0.0"`) makes the app return 502 behind render.com's proxy.

## Run

```bash
npm install
npm run build
npm run start:standalone
```

`scripts/run-standalone.js` starts `.next/standalone/server.js` with `HOSTNAME`
unset and then requests the app over loopback *and* over the machine's external
IPv4 address.

## Result

Both requests return `200`; the server logs `Network: http://0.0.0.0:3000`, i.e.
the standalone server already binds all interfaces when `HOSTNAME` is unset
(verified on next@16.3.1-canary.25 and next@15.1.4). So a missing `HOSTNAME` is
not what produced the 502. `Dockerfile.issue` keeps the reporter's original
runner stage for comparison; the current upstream example already sets
`ENV HOSTNAME="0.0.0.0"`.
