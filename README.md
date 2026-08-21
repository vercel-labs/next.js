# next#79182 — `request.url` host is not the requested host

Repro for https://github.com/vercel/next.js/issues/79182

```bash
npm install
npm run build
PORT=3000 node ./.next/standalone/server.js
# in another shell
curl -H 'Host: myhost.example:3000' 'http://127.0.0.1:3000/api/echo?name=127.0.0.1'
```

## Results

Next 16.3.1-canary.26 (standalone):

```
{"url":"http://0.0.0.0:3030/api/echo?name=127.0.0.1"}
```

Expected `http://myhost.example:3030/...` — the `Host` header is ignored and the
bind address (`0.0.0.0`, or `HOSTNAME`) is used instead. `next dev` has the same
problem, always reporting `http://localhost:<port>`.

The second half of the original report (any `127.0.0.1` in the path/query being
rewritten to `localhost`, e.g. `?name=127.0.0.1` -> `?name=localhost` on
15.4.0-canary.34) is fixed: `REGEX_LOCALHOST_HOSTNAME` in
`packages/next/src/server/web/next-url.ts` is now anchored and only applied to
`parsed.hostname`.
