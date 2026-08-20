# Repro for vercel/next.js#63520 — `Error.cause` from a Server Action on the client

Server Action throws `new Error('Email already exists', { cause: { status: 400, code: 'BA001' } })`.
The client component calls it in `useEffect`, catches, and renders the caught error fields into `#result`.

## Run

```bash
npm install
npm run dev      # open http://localhost:3000
npm run build && npm run start   # open http://localhost:3001
```

## Observed

- Next 16.3.1 / React 19 `next dev`: `{"message":"Email already exists","causeType":"object","cause":{"status":400,"code":"BA001"}}` — `cause` IS forwarded in dev.
- Next 16.3.1 production (`next build && next start`): `{"message":"Minified React error #441 ...","causeType":"undefined","cause":null}` — message and `cause` are redacted (documented behavior; only `digest` is sent).
- Next 14.1.4 `next dev` (the reported version, set `next@14.1.4` + `react@18.2.0`): `{"message":"Email already exists","causeType":"undefined","cause":null}` — reproduces the report: message forwarded in dev, `cause` dropped.
