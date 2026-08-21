# Repro: antd cssinjs SSR extraction + `__dirname` broken under Turbopack (next.js#77513)

Pages Router + `@ant-design/cssinjs` `extractStyle()` inside `pages/_document.js`.

```bash
npm install

# Turbopack (default on Next 16)
npx next build            # -> cssinjs cache entries after SSR = 1 ... extractStyle() length = 41
# webpack
npx next build --webpack  # -> cssinjs cache entries after SSR = 5 ... extractStyle() length = 72631
```

Also compare `next dev` vs `next dev --webpack` and look at the `[repro]` log lines.

Observed with Turbopack:
* `extractStyle(cache, true)` returns an empty stylesheet (`.data-ant-cssinjs-cache-path{content:"";}`),
  even though the rendered HTML contains antd's `css-<hash>` class names. antd's own copy of
  `@ant-design/cssinjs` never writes into the cache created in `_document`
  (a direct `useStyleRegister` call from the app *does* land in that cache), i.e. there are two
  module instances of `@ant-design/cssinjs` on the server.
* `__dirname` inside server code is the virtual path `/ROOT/pages`, which does not exist on disk,
  so any `fs` read relative to `__dirname` (as done by setups that read a pre-generated
  `antd.min.css`) fails with `ENOENT`. With webpack `__dirname` is
  `<project>/.next/server/pages` (a real directory).
