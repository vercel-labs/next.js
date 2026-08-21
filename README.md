# NEXT_PUBLIC_* env vars cannot be changed at runtime (docker) — next.js#77448

Minimal reproduction: `NEXT_PUBLIC_*` values are inlined into the server and client
bundles at `next build` time, so a single docker image cannot be reconfigured with
`docker run -e NEXT_PUBLIC_...`. Server-only vars (`PRIVATE_API_URL`) do pick up the
runtime value.

## Run (no docker needed)

```bash
npm install
npm run build            # .env.production sets both vars to BUILD_TIME_VALUE
NEXT_PUBLIC_API_URL=RUNTIME_VALUE PRIVATE_API_URL=RUNTIME_VALUE node .next/standalone/server.js
curl -s localhost:3000
```

## Observed (Next.js 16.3.1, node 24)

```
<p id="server-public">server NEXT_PUBLIC_API_URL: BUILD_TIME_VALUE</p>
<p id="server-private">server PRIVATE_API_URL: RUNTIME_VALUE</p>
<p id="client">client: BUILD_TIME_VALUE</p>
```

`grep -rl BUILD_TIME_VALUE .next/static` also shows the literal baked into the client chunk.

Expected by the reporter: `NEXT_PUBLIC_API_URL` resolves to `RUNTIME_VALUE`.

## Docker variant

```bash
docker build -t repro .
docker run --rm -p 3000:3000 -e NEXT_PUBLIC_API_URL=RUNTIME_VALUE -e PRIVATE_API_URL=RUNTIME_VALUE repro
```
