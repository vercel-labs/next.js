# Repro: build tracing globs the whole user profile (vercel/next.js#96824)

A dependency resolves a dynamic path rooted at `os.homedir()`:

```js
// packages/home-plugin-loader/index.js
exports.loadPlugin = (name) => require(path.join(os.homedir(), name))
```

`@vercel/nft` statically evaluates `os.homedir()`, turns the unknown segment
into a wildcard and emits the glob `<home>/**/*`, then walks it during
`next build --webpack` (`Collecting build traces`).

nft's only protection is
`ignoreFn(path.relative(job.base, globBase))` -> `startsWith('..' + path.sep)`.
On GitHub `windows-latest` the checkout is on `D:\a\...` and the profile on
`C:\Users\runneradmin`; `path.win32.relative()` across drives returns an
**absolute** path, so the guard is `false` and the entire user profile is
walked - where junction cycles and access-denied dirs turn into fatal
`EACCES: permission denied, scandir ...` webpack errors. Run `node
win32-guard.js` to see that guard flip.

## Run

```bash
./repro.sh
```

The script builds `/tmp/nft-home-glob-repro/{app,home}` (project + fake profile
under one tracing root, which recreates the same "guard is false" condition on
Linux/macOS), makes one profile directory unreadable, and runs
`next build --webpack`.

## Observed

- next `16.2.11`: build fails - `glob error [Error: EACCES: permission denied,
  scandir '<home>/.cache/protected']`, `Failed to compile.`, exit 1.
- next `16.3.1-canary.4`: build succeeds (newer bundled glob swallows the walk
  error) but the profile is **still** globbed and its files are copied into
  `.next/standalone/home/...`.
- Removing `outputFileTracingRoot` (so the profile is no longer under
  `job.base`) makes the glob ignored and the build green - which is why this is
  invisible on non-Windows CI.
