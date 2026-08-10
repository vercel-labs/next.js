# Repro: next@15.5.23 bundles vulnerable postcss and sharp (vercel/next.js#97011)

`next@15.5.23` pins `postcss@8.4.31` (dependency) and `sharp@^0.34.3` (optionalDependency).
Both ranges are covered by high-severity advisories, so `npm audit` reports 3 high
severity vulnerabilities on a fresh Next.js 15.5.23 project.

## Run

```bash
npm run repro
```

(equivalent to `npm install --package-lock-only && npm audit`)

## Expected

0 high severity vulnerabilities.

## Actual

```
postcss  <=8.5.22  Severity: high   (GHSA-r28c-9q8g-f849, GHSA-6g55-p6wh-862q,
                                     GHSA-qx2v-qp2m-jg93, GHSA-fxqj-rqcc-2cmp)
sharp    <0.35.0   Severity: high   (GHSA-f88m-g3jw-g9cj)
3 high severity vulnerabilities
```

`npm audit fix --force` proposes `next@16.3.0` (breaking). next@16.3.0 already ships
`postcss@8.5.23` and `sharp@^0.35.3`; the 15.x branch still needs those bumps.
