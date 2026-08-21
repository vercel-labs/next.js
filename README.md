# Repro: vercel/next.js#82017 — Next.js writes deprecated/invalid `moduleResolution`

`next@16.3.1-canary.26`, `typescript@5.9.3`, `@typescript/native-preview` (TS 7.0.0-dev).

```bash
npm i
npm run repro
```

Two scenarios, both starting from a hand-written `tsconfig.json`:

1. `module: "commonjs"` → Next.js forces `moduleResolution: "node"` (= deprecated `node10`).
   `tsgo` (TypeScript 7): `error TS5108: Option 'moduleResolution=node10' has been removed.`
2. `module: "nodenext"` (the reporter's config) → Next.js forces `moduleResolution: "bundler"`
   while leaving `module: "nodenext"`, producing an invalid tsconfig, and `next build` fails:
   `error TS5095` + `error TS5109` → `Failed to type check.`

`moduleResolution: "bundler"` set by the user is left alone on current canary; the two cases
above are the remaining broken paths.
