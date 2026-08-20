# Repro: middleware `req.url` / `req.nextUrl` ignore the `Host` header (issue #65568)

Minimal repro of https://github.com/vercel/next.js/issues/65568 without Docker: the server's
bind address/port is used for `req.url` and `req.nextUrl` instead of the incoming `Host` /
`x-forwarded-host` header. In Docker (`-p 3002:3000`) that bind address is the container
hostname/IP and the internal port 3000, which is what the reporter observes.

## Run

```bash
npm install
npm run build
npm start                 # next start -p 3000
# in another shell, simulate a proxy / docker port mapping:
curl -D- -H 'Host: myapp.example.com:3002' http://127.0.0.1:3000/api/hello
```

## Observed (Next 16.3.1)

```
MW {"reqUrl":"http://localhost:3000/api/hello","nextUrl":"http://localhost:3000/api/hello",
    "hostHeader":"myapp.example.com:3002","xForwardedHost":"myapp.example.com:3002"}
```

With `next start -H 0.0.0.0 -p 3001` the middleware reports `http://0.0.0.0:3001/api/hello`,
proving the bind hostname (not the request `Host`) is used.

Expected: `req.url` / `req.nextUrl` reflect `myapp.example.com:3002`.
