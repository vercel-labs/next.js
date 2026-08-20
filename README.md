# Repro: app-router singleton module is evaluated multiple times (vercel/next.js#65350)

`lib/singleton.js` is a plain module. Per ESM/CJS semantics it must be evaluated once per
process. It logs every evaluation plus a per-process counter (`globalThis.__singletonEvals`)
and a fresh random `value`.

## Run

```bash
npm install
npm run build                    # build-time
npm start                        # runtime (separate terminal)
curl localhost:3000/api/ping
curl localhost:3000/dynamic
```

## Observed (next 16.3.1, node 24, experimental.cpus: 4)

Build: 5 evaluations across 4 static-generation workers — and one worker logs
`evals-in-this-process=2`, i.e. two evaluations with two different values in one Node process.

`next start` (single process, one pid): 3 evaluations with 3 different `value`s — one from
`instrumentation.js` `register()`, one from the `/api/ping` route handler, one from the
`/dynamic` server component. Each server entry gets its own copy of the module, so
module-scope state (db clients, DI containers, caches) is not shared.
