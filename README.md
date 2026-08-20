# Reproduction: vercel/next.js#71807

`caniuse-lite` is declared in `next`'s `"dependencies"`, so it is installed for
production installs (`npm install --omit=dev`) and shows up in downstream
production SBOM / license scans (e.g. BlackDuck) with the `CC-BY-4.0` license,
which some legal policies disallow.

## Run

```bash
npm install --omit=dev
npm run repro
```

Exits 0 and prints `RESULT: REPRODUCED` when `caniuse-lite@CC-BY-4.0` is present
in the production-only tree via `next`.
