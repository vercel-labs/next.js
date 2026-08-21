# Repro: next.js#84095 — no option to emit hidden source maps for the client bundle

`productionBrowserSourceMaps: true` always uses webpack `devtool: 'source-map'`, so every
client chunk gets a `//# sourceMappingURL=` comment. Browsers/users then fetch the `.map`
files, and apps that upload maps only to an error tracker (and delete/never publish them)
get 404 noise. There is no config option for `hidden-source-map` (maps emitted, no
`sourceMappingURL` comment), and no bundler-agnostic equivalent for Turbopack/Rspack.

## Run

```
npm install
npm run build
grep -c sourceMappingURL .next/static/chunks/*.js
```

Expected: an option (e.g. `productionBrowserSourceMaps: 'hidden'`) that emits `.map`
files without the `sourceMappingURL` comment, for webpack and Turbopack.

Actual: comments are always present; the only fix is a webpack-only `next.config` hack
(`config.devtool = 'hidden-source-map'`).
