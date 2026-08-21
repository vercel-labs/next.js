# next#89753 — webpack cache warning from `@next/mdx` (`mdx-js-loader.js`)

Minimal App Router + `@next/mdx` app (next 16.1.6), mirrored from the reporter's repro,
plus a harness that pins the exact condition under which the warning is emitted.

## A. Reporter's steps (did NOT warn in a clean Linux env)

```bash
npm install
rm -rf .next
npx next build --webpack            # verbose: NEXT_WEBPACK_LOGGING=infrastructure npx next build --webpack
```

Verified with Node 24.17 and Node 25.2.1, npm and pnpm installs, cold and warm
`.next/cache`, incremental builds, and verbose webpack infrastructure logging:
build succeeds and **no** `PackFileCacheStrategy/FileSystemInfo` warning is printed.

`node_modules/@next/mdx/mdx-js-loader.js` *is* a build dependency of the server
compilation, but because the loader was `require()`d while compiling `page.mdx`
it is present in `require.cache`, so webpack's `FileSystemInfo` walks
`require.cache[...].children` instead of parsing the file — no warning.

## B. Deterministic harness (warning reproduced)

`next.config.warning.mjs` is the same config plus a plugin that drops the loader
from `require.cache` before webpack snapshots build dependencies (i.e. it emulates
a build where the MDX loader was never required in this process):

```bash
npm install
cp next.config.warning.mjs next.config.mjs   # keep a copy of the original first
rm -rf .next
npx next build --webpack
```

Output:

```text
<w> [webpack.cache.PackFileCacheStrategy/webpack.FileSystemInfo] Parsing of /.../node_modules/@next/mdx/mdx-js-loader.js for build dependencies failed at 'import(process.platform === 'win32' ? pathToFileURL(path) : path)'.
<w> Build dependencies behind this expression are ignored and might cause incorrect cache invalidation.
```

So the warning text and its source (the dynamic `import()` in `@next/mdx`'s
`mdx-js-loader.js`) are real, but reaching it requires the loader to be absent
from `require.cache` when build dependencies are resolved.
