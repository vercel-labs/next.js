# Repro: Turbopack dev emits invalid VLQ column deltas (~2^32) for pre-minified vendor sources

Issue: https://github.com/vercel/next.js/issues/93462 (mirrors
https://github.com/aiwilliams/nextjs-turbopack-invalid-mappings-repro with a
pnpm 11 build-script approval and a headless verification script).

## Run

```bash
pnpm install
pnpm dev          # next dev --turbopack -p 3099
node verify-mappings.mjs   # exits 1 and prints the invalid segments
```

Firefox at http://localhost:3099/ logs:
`Source Map ".../node_modules__pnpm_<hash>._.js.map" has invalid "mappings"`.
`verify-mappings.mjs` reproduces the same defect without a browser: it fetches the
chunk map and VLQ-decodes it.

## Observed (next@16.3.0-canary.9, dev + Turbopack)

```
section 2 sources=simplepeer.min.js hugeColumnDeltas=2
  huge: IAKw/67//H [4,0,5,4294899192] genLine 6
  huge: AAL5367//H [0,0,-5,-4294899068] genLine 7
```

`simplepeer.min.js` has a max line length of 97,039, so an original-column delta of
4,294,899,192 (= 2^32 - 68,104) is structurally impossible; Mozilla's `source-map`
consumer resolves the affected segment to `originalColumn: -67948`.

`pnpm build` maps for the same input contain 0 such deltas, so this is dev-only.
