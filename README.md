# next#92339 — static export writes RSC segment files into nested dirs on Windows

`output: 'export'` + a nested route (`/foo/bar`). `packages/next/src/export/index.ts` computes the
segment path with `path.relative()` (backslashes on Windows) and
`convertSegmentPathToStaticExportFilename()` only replaces `/`, so the backslashes survive into
`path.join(segmentsDirDest, segmentFilename)` and become directories.

* Windows build:  `out/foo/bar/__next.foo\bar\__PAGE__.txt` -> `out/foo/bar/__next.foo/bar/__PAGE__.txt`
* Expected/Linux: `out/foo/bar/__next.foo.bar.__PAGE__.txt`

The client router always requests the flat, dot-separated name, so the prefetch 404s.

## Run (any OS, the Windows case is emulated deterministically)

```bash
npm install
npm run repro     # next build && node repro.mjs -> exits 1 and prints the nested path
```

`repro.mjs` imports Next.js' own `convertSegmentPathToStaticExportFilename` and replays the export
copy logic with both `path.posix` and `path.win32`, then prints what this machine actually wrote to
`out/`. On Linux/macOS only the emulated `win32` case fails; running `next build` on Windows
produces the nested directory for real.
