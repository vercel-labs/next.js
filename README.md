# Reproduction: vercel/next.js#61125

Pages Router API route `config` export is rejected when written with `as const`.

## Run

```bash
npm install
npm run build
```

## Observed (next 15.5.7)

```
 ⨯ Next.js can't recognize the exported `config` field in route "/api/test":
Unsupported node type "TsConstAssertion" at "config".
Read More - https://nextjs.org/docs/messages/invalid-page-config
 ⨯ Invalid segment configuration export detected. ...
```

`next build` exits with code 1. `pages/api/plain.ts` (same object, no `as const`) is accepted.

## Version matrix (verified locally)

| next | result |
| --- | --- |
| 13.5.6 | warning `Unsupported node type "TsConstAssertion"`, build succeeds, default config used |
| 14.2.33 | same warning (repeated per compilation), build succeeds |
| 15.5.7 | hard error, `next build` fails (exit 1) |
| 16.3.1 / 16.3.1-canary.25 | no error; `as const` config is honored (verified: 413 "Body exceeded 1kb limit" with `sizeLimit: '1kb' as const`) |
