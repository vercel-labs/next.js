# Repro: #91661 — ERR_REQUIRE_ESM on deployed Node functions with `"type": "module"` (Next.js 16.2.0)

Root cause: in 16.2.0 `.next/package.json` (the `{"type":"commonjs"}` boundary marker
that `next build` writes) is **not** listed in `.next/required-server-files.json`.
Deployment adapters (Vercel, Firebase/Cloud Run, standalone consumers) build the Node
function from `requiredServerFiles.files`, so the marker is dropped. If the project
`package.json` (with `"type": "module"`) *is* included in the function — which happens
in real monorepos via file tracing — Node treats `.next/server/app/page.js` as ESM and
`___next_launcher.cjs` fails with `ERR_REQUIRE_ESM`.

This repro forces that condition deterministically with
`outputFileTracingIncludes: { '/': ['./package.json'] }` instead of a large monorepo.

## Steps

```bash
npm install
npx next build
# 16.2.0: no ".next/package.json" entry -> boundary marker is not shipped
node -e "console.log(require('./.next/required-server-files.json').files.filter(f=>f.endsWith('package.json')))"
```

Then deploy this directory to Vercel (default settings, Node 22) and request `/`:
the dynamic page returns HTTP 500 (`ERR_REQUIRE_ESM ... .next/server/app/page.js`).

## Control

Change `next` to `16.3.1` in `package.json` and repeat: the manifest contains
`.next/package.json` and the deployed page returns HTTP 200.
Fixed upstream by commit 8f132ea9848b52e6717959d9ced4efda44ab430d (#93612).
