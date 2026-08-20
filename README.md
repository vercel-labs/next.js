# Reproduction: vercel/next.js#46018 — no way to subscribe to server modules unloading in dev

Next.js: canary (see package.json / lockfile). Steps:

```
npm install
npm run dev          # terminal 1
curl localhost:3000/api/hello
# edit lib/unrelated.ts (change 'v1' -> 'v2'), then:
curl localhost:3000/api/hello
```

`lib/BackendMock.ts` starts a `setInterval` once per module instance and logs a unique
module id. After each edit of an *unrelated* dependency, the whole module graph of the
route is re-evaluated: a new module instance starts a new interval while the old
interval keeps running. `module.hot` is undefined in the server runtime, so there is no
dispose hook to clear the interval / close a DB connection.

Observed after two edits: three module ids polling concurrently.
