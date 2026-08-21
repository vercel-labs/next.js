# Repro: next lint prints "TypeScript version not officially supported" (vercel/next.js#78484)

`eslint-config-next` allows `@typescript-eslint/parser` `^5.4.2 || ^6 || ^7 || ^8`.
When the installed tree resolves to a v7 parser (as an existing lockfile commonly does),
`@typescript-eslint/typescript-estree` prints the unsupported-TypeScript-version banner on
every `next lint` run with TypeScript 5.7.3. The pinned lockfile here freezes that resolution.

## Run

```bash
pnpm install
rm -f .eslintcache      # `next lint` caches results, so a warm cache hides the banner
pnpm run lint           # must run in a TTY: the banner is only printed when process.stdout.isTTY
```

## Observed

```
=============
WARNING: You are currently running a version of TypeScript which is not officially supported by @typescript-eslint/typescript-estree.
SUPPORTED TYPESCRIPT VERSIONS: >=4.7.4 <5.6.0
YOUR TYPESCRIPT VERSION: 5.7.3
=============
```

## Control

Removing the two `@typescript-eslint/*` pins and reinstalling resolves the parser to 8.x,
which supports TypeScript 5.7, and no banner is printed.
