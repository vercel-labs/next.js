# Repro: standalone server leaks middleware rewrite as 307 (vercel/next.js#91845)

Minimal reproduction (no next-intl) for Next.js 16.2.1 `output: 'standalone'`.

`middleware.js`:
- `/` -> `NextResponse.rewrite('/target')` (should be internal/transparent)
- `/target` -> `NextResponse.redirect('/redirected')` (mimics next-intl `localePrefix: 'as-needed'`)

## Run

```bash
npm install
npm run build
cp -r .next/static .next/standalone/.next/
PORT=3000 HOSTNAME=127.0.0.1 node .next/standalone/server.js
curl -s -o /dev/null -D - http://127.0.0.1:3000/
```

### Broken (standalone, HOSTNAME=127.0.0.1)

```
HTTP/1.1 307 Temporary Redirect
x-middleware-rewrite: http://localhost:3000/target
location: /redirected
```
Server log shows middleware invoked twice: `GET /` then `GET /target`.
The rewrite is emitted as an absolute `http://localhost:PORT/...` URL, treated as
external, re-enters the middleware, and the second response leaks to the client.

### Works: same build via `next start`

```
HTTP/1.1 200 OK
x-middleware-rewrite: /target
```
Middleware only invoked for `GET /`.

### Works: standalone with `HOSTNAME=localhost` or `HOSTNAME=0.0.0.0`

```
HTTP/1.1 200 OK
x-middleware-rewrite: /target
```

So the trigger is the standalone server building the middleware request origin as
`http://localhost:PORT` while HOSTNAME is a different literal (e.g. `127.0.0.1`).
