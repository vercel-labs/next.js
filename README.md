# Turbopack minifier emits illegal octal escapes in template literals

Reproduction for https://github.com/vercel/next.js/issues/97331

Cesium inlines its draco/basis WASM binaries as JavaScript string literals containing
raw control bytes. Turbopack's minifier rewrites one of those strings into a **template
literal** without re-escaping, so `\0` followed by a digit survives as an octal escape,
which is illegal in untagged template literals. The emitted client chunk is therefore
not parseable JavaScript.

## Run

```bash
npm install
npm run build          # Turbopack (Next 16 default) – succeeds
npm run check-chunks   # node --check every emitted client chunk – FAILS
```

Expected: `all chunks parse OK`.

Actual:

```
PARSE FAIL: .next/static/chunks/<hash>.js
SyntaxError: Octal escape sequences are not allowed in template strings.
1 chunk(s) failed to parse
```

The failing chunk is the one carrying `@cesium/engine`. In the browser
(`npm start`, open `/`) the same chunk throws an uncaught
`SyntaxError: Octal escape sequences are not allowed in template strings.`,
so the dynamic `import('cesium')` never resolves.

## Workaround

```bash
npm run build:webpack && npm run check-chunks   # passes
```
