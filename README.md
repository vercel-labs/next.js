# Repro: issue #84196 — root `loading.js` prevents `permanentRedirect()` from returning 308

## Run

```bash
npm install
npm run dev
curl -sS -D - -o /dev/null http://localhost:3000/redirect   # => 200, no Location
mv app/loading.js /tmp/ && sleep 2
curl -sS -D - -o /dev/null http://localhost:3000/redirect   # => 308 Permanent Redirect, location: /target
```

Same result with `npm run build && npm start`, and with `next@canary` (16.3.1-canary.26).

`app/redirect/page.js` calls `permanentRedirect('/target')` after an await. With a root
`app/loading.js` present, the shell streams first so headers/status are flushed as 200
and the redirect only happens on the client.
