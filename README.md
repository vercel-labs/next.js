# Repro: next/* unresolvable with `"type": "module"` + `moduleResolution: nodenext`

Issue: https://github.com/vercel/next.js/issues/46078

## Run

```bash
npm install
npx tsc --noEmit
```

## Observed (next@16.3.1-canary.25, typescript 5.9)

```
src/page.tsx(1,18): error TS2307: Cannot find module 'next/head' or its corresponding type declarations.
src/page.tsx(2,18): error TS2307: Cannot find module 'next/link' or its corresponding type declarations.
src/page.tsx(3,19): error TS2307: Cannot find module 'next/image' or its corresponding type declarations.
```

`next/package.json` still has no `exports` field, so under Node16/NodeNext resolution the
extensionless subpaths `next/head`, `next/link`, `next/image` do not resolve.

Using `next/link.js` resolves the module but then fails with TS2786 /
TS2604 (`'Link' cannot be used as a JSX component`) because the CJS
`export = ` shape is not interop-compatible in an ESM file.

Control: switching to `module: esnext` + `moduleResolution: bundler` type-checks cleanly.
