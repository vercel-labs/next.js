# Repro: `next build` fails prerendering internal `/_global-error` when NODE_ENV=development

Issue: https://github.com/vercel/next.js/issues/87719

Minimal App Router app (no `global-error.tsx`, no `.env`).

## Steps

```bash
pnpm install
NODE_ENV=development pnpm next build   # fails
pnpm next build                        # succeeds
```

## Observed (next 16.3.1, also 16.1.1)

```
⚠ You are using a non-standard "NODE_ENV" value in your environment.
Error occurred prerendering page "/_global-error".
TypeError: Cannot read properties of null (reading 'useContext')
Export encountered an error on /_global-error/page: /_global-error, exiting the build.
⨯ Next.js build worker exited with code: 1
```

Notes:
- Only a real environment variable (e.g. `ENV NODE_ENV=development` in a Dockerfile / CI) triggers it; `NODE_ENV=development` inside `.env` is stripped by Next and the build passes.
- The failing route `/_global-error` is internal and not user-defined.
