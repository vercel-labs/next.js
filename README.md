# Reproduction: `next dev` (webpack) hangs forever on a module request > ~8.39M chars

Upstream issue: https://github.com/vercel/next.js/issues/97364

```bash
npm install
node generate.mjs            # writes src/big.mjs (13,280,481-char data: URI)
npm run dev                  # next dev -p 3247
curl --max-time 60 http://localhost:3247/   # exits 28 (timeout); server logs RangeError
```

The dev server logs `RangeError: Maximum call stack size exceeded at RegExp.exec` as an
`unhandledRejection` and the request never resolves. `npm run dev:turbo` (Turbopack) compiles fine.
