# next#97959 — `.env` values are `null` in a Docker standalone build

Minimal reproduction of https://github.com/vercel/next.js/issues/97959 (Next.js 16.3.3, `output: 'standalone'`).

## Docker

```
docker build . -t next-env-issue
docker run -p 3000:3000 next-env-issue
curl localhost:3000/api/env   # {"NEXT_PUBLIC_MY_VAR":null,"MY_VAR":null}
```

## Without Docker (same result)

`./repro.sh` emulates the docker build context (`.dockerignore` drops `.env`) → `null`s.
`./repro.sh with-env` keeps `.env` in the context → `{"NEXT_PUBLIC_MY_VAR":"public_value","MY_VAR":"private_value"}`.

## Root cause

`.dockerignore` (copied from `examples/with-docker`) lists `.env`, so the file never reaches the
build context. `next build` therefore inlines nothing and copies no `.env` into `.next/standalone`.
Next.js 15.5.4 behaves identically, so this is not a 16.x runtime regression — it is the example's
`.dockerignore`.
