# Reproduction: vercel/next.js#77319 — empty slot directory fails production build

Git cannot store empty directories, so `npm run setup` (invoked by `npm run build`)
creates the empty `src/app/@slot/` directory before building.

```bash
npm install
npm run build
```

## Observed

next@15.2.3 (`npm run build`):

```
src/app/layout.tsx
Type error: Type 'Readonly<{ children: ReactNode; }>' does not satisfy the constraint 'LayoutProps'.
  Property 'slot' is missing in type 'Readonly<{ children: ReactNode; }>' but required in type 'LayoutProps'.
```
exit code 1.

next@16.3.1: build succeeds (empty slot dir ignored) — fixed upstream.
