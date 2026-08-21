# Repro: vercel/next.js#83459 — vendored cross-spawn@7.0.3 (CVE-2024-21538)

```bash
npm install
npm run verify
```

What it checks, against the installed `next` package:

1. `next/package.json` still pins `cross-spawn: 7.0.3` (published in `devDependencies`, which SCA
   tools such as Trivy read from `node_modules/next/package.json`).
2. `next/dist/compiled/cross-spawn/index.js` contains the **pre-7.0.5** `escapeArgument` regexes
   (`/(\\*)"/g`, `/(\\*)$/`) and not the patched `(?=(\\+?)?)` form, i.e. the bundled code really is
   7.0.3 and not just a stale version string. The vendored `package.json` has no `version` field.
3. A timing benchmark showing the quadratic blowup of the vendored regex (~1.4s for 40k backslashes)
   versus ~1ms for the 7.0.5 fix.
4. OSV lookup confirming `cross-spawn@7.0.3` → GHSA-3xgq-45jj-v275 / CVE-2024-21538 (HIGH).

Verified with next 14.2.32, 15.3.2, 15.5.2 and 16.3.1: all bundle the unpatched code.
Note 16.x no longer lists `cross-spawn` in the published `package.json`, so manifest scanners stay
quiet there, but `dist/compiled/cross-spawn/index.js` still contains the 7.0.3 code.
`packages/next/package.json` on canary still pins `7.0.3`.
