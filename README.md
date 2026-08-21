# Repro: issue #92836 — `TypeError: Unexpected response from worker: undefined`

Custom server + `node --watch-path` in dev: requesting a dynamic route floods the
console with `uncaughtException: TypeError: Unexpected response from worker: undefined`.

```bash
npm install
npm run start:dev
curl http://localhost:3000/foo/pippo
```

Observed with next 16.3.1 and 16.1.6 (~1900 occurrences per request).
Removing `--watch-path=.server` from `start:dev` makes the errors disappear.
