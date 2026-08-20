# Repro: vercel/next.js#39161 — spurious next.config.js warnings with next-compose-plugins

`next-compose-plugins` spreads Next.js' own `defaultConfig` into the user config
(`{...defaultConfig, ...nextConfig}`), so every internal default key is treated as a
user-supplied option and re-validated / re-mapped by Next.

## Run

```bash
npm install
npx next dev      # or: npx next build
```

## Observed (next@16.3.1-canary.25)

```
⚠ `experimental.browserDebugInfoInTerminal` has been moved to `logging.browserToTerminal`.
  Please update your next.config.js file accordingly.
```

The config file never sets `experimental.browserDebugInfoInTerminal`; it comes from
`defaultConfig`. The original 12.x report ("Invalid next.config.js options detected"
listing `webpack5`, `target`, `webpackDevMiddleware`, `configOrigin`, `i18n`, ...) no
longer appears because those keys were removed from `defaultConfig` / the schema, and
`next build` now succeeds.
