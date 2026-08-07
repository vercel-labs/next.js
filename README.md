# Repro: Turbopack does not respect `experimental.forceSwcTransforms` (vercel/next.js#73087)

```bash
npm install
npm run dev   # next dev --turbopack
# then: curl http://localhost:3000/
```

`next.config.mjs` sets `experimental.forceSwcTransforms: true` and a Babel config
(`.babelrc`) exists in the project root.

Observed on next@16.3.1-canary.7:

```
- Experiments (use with caution):
  ✓ forceSwcTransforms

⨯ You are using configuration and/or tools that are not yet
supported by Next.js with Turbopack:

- Unsupported Next.js configuration option(s) (next.config.js)
  Turbopack will ignore the following configuration options:
    - experimental.forceSwcTransforms

  Using external babel configuration from <root>/.babelrc
```

Turbopack ignores `forceSwcTransforms` and still runs the Babel loader on app code.
With a `babel.config.cjs` (ESM project) it is fatal:
`Error: The Next.js Babel loader does not support .mjs or .cjs config files.` -> `GET / 500`.

On next@15.0.3 the same config aborts `next dev --turbopack` outright with
"Babel is not yet supported ... remove experimental.forceSwcTransforms".
