# Repro: middleware cannot see env vars set asynchronously in `next.config.js` (#69409)

`next.config.js` starts async work at load time and sets
`process.env.ENV_WITH_CONFIGURE_NEXT = 'true'` 10s later.
`middleware.js` logs three env vars on every request.

```bash
npm install
npm run repro     # or: npm run dev, then curl http://localhost:3000 twice (before & after t+10s)
```

Observed (Next.js 16.3.1, also with `next build && next start`):

```
# request before the async set completes
MW ENV_WITH_INSTRUMENTATION: true
MW ENV_WITHOUT_CONFIGURE_NEXT: true
MW ENV_WITH_CONFIGURE_NEXT: undefined

[next.config] set ENV_WITH_CONFIGURE_NEXT at t+10s

# request AFTER the async set completed -> still undefined
MW ENV_WITH_INSTRUMENTATION: true
MW ENV_WITHOUT_CONFIGURE_NEXT: true
MW ENV_WITH_CONFIGURE_NEXT: undefined
```

Expected: the third value becomes `true` once the async work in
`next.config.js` completes.

Notes:
- If the *first* request happens after the async mutation completes, the value
  is `true` — the edge/middleware `process.env` snapshot is captured when the
  middleware sandbox is first created and is never refreshed afterwards.
- The reporter used the `middleware.js` convention; on Next 16 the same happens
  with `proxy.js`.
