# Repro: Next.js 14 docs installation snippet installs latest (Next 16 / React 19)

Issue: https://github.com/vercel/next.js/issues/76998

The versioned v14 docs page https://nextjs.org/docs/14/getting-started/installation
(`version: 14.2.35` in its frontmatter) still tells readers to run:

```bash
npx create-next-app@latest
# and, for manual install
npm install next@latest react@latest react-dom@latest
```

So a reader who explicitly selected the 14.x docs gets whatever `latest` is today
(Next 16.3.1 / React 19.2.x), not Next 14.

## Run

```bash
./repro.sh
```

Exits non-zero and prints the mismatch when the installed `next` version is not 14.x.

## Observed (2025, npm latest = next 16.3.1)

```
installed next 16.3.1 react 19.2.8 react-dom 19.2.8
▲ Next.js 16.3.1 (Turbopack)  -> http://localhost:3000 responds 200
FAIL: docs/14 install snippet produced next 16.3.1 (expected 14.x)
```
