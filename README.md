# Repro: vercel/next.js#82944

`next build` rewrites `"module": "node20"` (TS 5.9+) to `"esnext"` in tsconfig.json,
even though `node20` supports dynamic `import()`. `"moduleResolution": "node20"` is
likewise rewritten to `"bundler"`.

## Run

```bash
npm install
npx next build
git diff tsconfig.json
```

## Observed

```
The following mandatory changes were made to your tsconfig.json:

     - module was set to esnext (for dynamic import() support)
     - moduleResolution was set to bundler (to match modern bundler resolution)
```

## Expected

`module: node20` / `moduleResolution: node20` left untouched, as with `node16` / `nodenext`.

Cause: `packages/next/src/lib/typescript/writeConfigurationDefaults.ts` allow-lists
only `preserve`, `es2020`, `esnext`, `commonjs`, `amd`, `nodenext`, `node16` for `module`
and `node16`, `nodenext`, `bundler` for `moduleResolution`.
