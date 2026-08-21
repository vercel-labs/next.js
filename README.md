# Reproduction for vercel/next.js#76913

`fetch(process.env.API_URL)` in a server component whose host (`http://backend:8000/...`) only
exists inside the Docker compose network. The route has no dynamic API, so Next.js **prerenders it
during `next build`** (inside `docker build`, where the compose network does not exist). The
`ENOTFOUND backend` result is baked into the static HTML/RSC payload and keeps being served at
runtime, even though `backend` is reachable from the running container.

`app/page.tsx` is the reporter's code verbatim (the `.catch()` renders the error instead of failing
the build, so the build succeeds and the failure is only visible at runtime).
`app/dynamic/page.tsx` is identical plus `export const dynamic = "force-dynamic"` and works.

## Run (Linux, no Docker needed)

```
npm install
npm run repro    # = unshare -m ./run-repro.sh
```

The script builds with `backend` unresolvable, then starts a JSON server on `backend:8000` and the
standalone Next.js server, and curls both routes.

## Observed (next@15.2.0 and next@16.3.1)

```
Route (app)
┌ ○ /                       <- static, prerendered during build
└ ƒ /dynamic

GET /        -> <h1>Error</h1><pre>{"message":"fetch failed","cause":{"errno":-3008,"code":"ENOTFOUND","syscall":"getaddrinfo","hostname":"backend"}}</pre>
GET /dynamic -> <h1>API Response</h1><pre>{"message":"hello from backend"}</pre>
```
