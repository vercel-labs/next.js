# Repro: Turbopack cannot resolve SWC wasm plugin given an absolute path (#78156)

Next.js `16.3.1-canary.26`.

`experimental.swcPlugins` configured with the absolute path returned by
`require.resolve()` breaks `next build --turbopack`, while `next build --webpack`
succeeds with the exact same config.

## Run

```bash
npm install
npx next build --webpack    # exit 0 - works
npx next build --turbopack  # exit 1 - Module not found
```

## Actual (Turbopack)

```
Error: Turbopack build failed with 2 errors:
./
Error: Module not found: Can't resolve './<cwd>/node_modules/@swc/plugin-react-remove-properties/swc_plugin_react_remove_properties.wasm'
server relative imports are not implemented yet. Please try an import relative to the file you are importing from.

./
Error: Module not found: Can't resolve '/<cwd>/node_modules/@swc/plugin-react-remove-properties/swc_plugin_react_remove_properties.wasm'
```

Note the leading `.` prepended to the already-absolute path: the absolute path is
treated as a server-relative request instead of a filesystem path.

## Expected

Absolute plugin paths (the normal output of `require.resolve()`) resolve, as they do with webpack.

## Workaround

Passing a cwd-relative path builds successfully under Turbopack and the plugin is
applied (`data-custom` is stripped from the output):

```js
["./" + path.relative(process.cwd(), require.resolve("@swc/plugin-react-remove-properties")), {}]
```
