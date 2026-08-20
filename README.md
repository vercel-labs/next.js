# Repro: standalone `server.js` binds to `$HOSTNAME` (Docker Swarm unreachable) — vercel/next.js#71826

`output: 'standalone'` generates:

```js
const hostname = process.env.HOSTNAME || '0.0.0.0'
```

Docker sets `HOSTNAME` in every container's environment, so the Next server binds to
that single resolved address instead of `0.0.0.0`. In Docker Swarm the published port
is delivered on the ingress/routing-mesh address of the task, which is *not* the
address `HOSTNAME` resolves to, so `curl localhost:3000` returns
`curl: (52) Empty reply from server` / connection refused while the container looks healthy.

## Reproduce without Docker (deterministic, ~1 min)

```bash
npm run repro
```

`HOSTNAME=127.0.0.2` stands in for "the address Docker gave this task":
the server prints `Local: http://127.0.0.2:3000`, `127.0.0.2:3000` answers 200,
and the address the port mapping targets (`127.0.0.1:3000`) is unreachable.
Reproduced on next@14.2.11 and next@16.3.1.

Case 3 reproduces the follow-up report `Error: getaddrinfo ENOTFOUND "0.0.0.0"`:
a quoted value in a compose file is passed verbatim to `getaddrinfo`, with no validation
or fallback.

## Reproduce with Docker Swarm

```bash
docker build -t next-swarm-repro .
docker swarm init
docker stack deploy -c stack.yml next-swarm-repro
curl -v localhost:3000   # empty reply / connection reset
```

Workaround: explicitly set `HOSTNAME=0.0.0.0` (unquoted) in the service environment.
