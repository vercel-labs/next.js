# Repro: `@next/codemod` rewrites every line ending (vercel/next.js#42437)

The next-codemod transforms (e.g. `new-link`) call `.toSource()` without a
`lineTerminator` option, so recast falls back to `os.EOL` and reprints the whole
file with the *platform* line ending instead of the file's own line ending.

* On Windows (`os.EOL === '\r\n'`): LF files become CRLF -> whole-file diffs (the report).
* On Linux/macOS (`os.EOL === '\n'`): CRLF files become LF -> same bug, opposite direction.

## Fixtures
* `pages/lf.js`  - 9 LF lines
* `pages/crlf.js` - 9 CRLF lines
* `.gitattributes` sets `* -text` so the fixtures keep their bytes on any OS.

## Run

```sh
npm run repro:linux             # real codemod run; pages/crlf.js loses all CRLF
npm install                     # needed once for the next script
npm run repro:windows-emulated  # os.EOL stubbed to \r\n; pages/lf.js gains CRLF
```

### Observed (Linux, @next/codemod@canary)
```
before: pages/crlf.js CRLF lines = 9   pages/lf.js CRLF lines = 0
after : pages/crlf.js CRLF lines = 0   pages/lf.js CRLF lines = 0
 pages/crlf.js | 18 +++++++++---------
```

### Observed (windows-emulated, os.EOL = "\r\n")
```
input  CRLF/LF : 0 / 9
output CRLF/LF : 9 / 0
```

Workaround from the issue thread: `--jscodeshift="--lineTerminator=$'\n'"`
(only works for transforms that don't pass their own printOptions).
