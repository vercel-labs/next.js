# Repro: "Malformed PostCSS Configuration" with an ESM postcss.config.js exporting instantiated plugins

Issue: https://github.com/vercel/next.js/issues/68887

## Run

```bash
npm install --legacy-peer-deps
npm run build          # next build --webpack  -> FAILS
npm run dev            # next dev --webpack    -> 500 + build error in browser
npm run build:turbopack # next build (Turbopack) -> succeeds
```

## Observed (Next.js 16.3.1, webpack)

```
Error: An unknown PostCSS plugin was provided ([object Object]).
Read more: https://nextjs.org/docs/messages/postcss-shape
Failed to compile.
./app/layout.module.css
Error: Malformed PostCSS Configuration
    at .../next/dist/build/webpack/config/blocks/css/plugins.js:178:41
```

## Notes

- Not ESM-specific: the same config written as CommonJS (`postcss.config.cjs` with
  `module.exports = { plugins: [presetEnv({stage:2})] }`) fails identically.
- Root cause is Next's webpack PostCSS config normalization
  (`build/webpack/config/blocks/css/plugins.js`), which only accepts string /
  `[string, options]` / object-map plugin entries and rejects already-instantiated
  plugin objects that plain PostCSS accepts.
- Object-map form (`plugins: { 'postcss-preset-env': { stage: 2 } }`) works, so ESM
  config loading itself is fine.
- Turbopack (default in Next 16) loads the same config successfully; only the
  webpack path errors.
