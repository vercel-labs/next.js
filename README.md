# Repro: vercel/next.js#92950 — bundled `dist/compiled/picomatch` still 4.0.3

```sh
npm install
npm run verify
```

`package.json` pins top-level `picomatch@4.0.4`, yet `next/dist/compiled/picomatch`
still resolves to a 4.0.3 build (`*(a|a)` compiles to the backtracking
`^(?:(?=.)(?:a|a)*)$`, while 4.0.4 emits a literal match). The script also times the
regex on a 29-char input and calls `matchRemotePattern`, which uses the bundled copy
at runtime for image-optimizer `remotePatterns`.

Verified against next 15.5.23, 16.2.4, 16.3.2 (latest) and 16.4.0-canary.1 — the bundled
`index.js` is byte-identical (23,905 B, sha1 6e92069f…) on 15.x/16.2.x and 23,909 B
(sha1 fa62f925…) on 16.3.2/canary; neither contains the 4.0.4 `maxExtglobRecursion` fix.
