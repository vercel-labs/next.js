# Repro: Next.js #48219 — rewrite `has: [{ type: 'host' }]` drops the port

```bash
npm install
npm run dev
curl -s -H 'Host: localhost:3000' http://localhost:3000/api/echo
```

Expected: `matchedHost` equals the `Host` header (`localhost:3000`).
Actual: `{"hostHeader":"localhost:3000","matchedHost":"localhost"}`

Cause: `getMatchedHost`/`matchHas` in `shared/lib/router/utils/prepare-destination.ts`
does `host?.split(':', 1)[0].toLowerCase()`, stripping the port before the `has` regex runs.
