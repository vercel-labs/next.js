# Repro: vercel/next.js#77539 — env var undefined in next.config.ts at runtime

Docker-free reproduction of https://github.com/vercel/next.js/issues/77539.

```bash
npm install
npm run repro
```

The script builds with `REWRITE_URL` unset (like `docker build`), then starts the
`output: 'standalone'` server with `REWRITE_URL=https://www.example.com` in the
environment (like `docker compose up`). `/rewrite` still resolves to the
build-time fallback `/fail-to-rewrite`, because `rewrites()` is evaluated during
`next build` and serialized into `.next/routes-manifest.json`.

Reproduced on next 15.3.0-canary.24 (reported) and 16.3.1-canary.26.
