# Repro: Turbopack lacks webpack's `resolve.extensionAlias` (next#82945)

`lib/foo.ts` imports `./bar.js` while only `lib/bar.ts` exists on disk.

```bash
npm install
npm run dev          # Turbopack -> 500, Module not found: Can't resolve './bar.js'
npm run dev:webpack  # webpack + resolve.extensionAlias -> 200, renders "hello from bar.ts"
```

Reproduced with next@15.5.0 (as reported) and next@16.3.1-canary.26.
Turbopack config exposes only `turbopack.resolveExtensions` (a flat list), with no
per-extension alias mapping equivalent to `{ '.js': ['.ts', '.tsx', '.js'] }`.
