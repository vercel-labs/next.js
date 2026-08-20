# Repro for vercel/next.js#49684 (docs: config redirects are evaluated at build time)

`next.config.js` `redirects()` reads `process.env.REDIRECT_TARGET`.

```
npm install
REDIRECT_TARGET=/from-build npx next build
REDIRECT_TARGET=/from-runtime npx next start -p 3111
curl -sI localhost:3111/go
```

Observed: `location: /from-build` (307). The runtime env value is ignored and `redirects()`
is not re-evaluated by `next start`; the resolved list is baked into
`.next/routes-manifest.json` at build time. This is the behavior the issue asks the docs
to state explicitly.
