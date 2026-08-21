# Repro: `agents-md` writes a command that fails in a clean checkout (#89772)

`npx @next/codemod agents-md --output AGENTS.md` injects this self-healing instruction into `AGENTS.md`:

> If docs missing, run this command first: `npx @next/codemod agents-md --output AGENTS.md`

An agent following it in a fresh clone (dependencies not installed yet, `.next-docs` is gitignored so docs are indeed missing) gets:

```
Could not detect Next.js version. Use --version to specify.
Example: npx @next/codemod agents-md --version 15.1.3 --output AGENTS.md
```

exit code 1.

## Run

```bash
./repro.sh
```

Do **not** run `npm install` first — the point is the pre-install state of a clean checkout.

## Cause

`runAgentsMd` resolves the version only through the installed package:
`getNextjsVersion()` in `packages/next-codemod/lib/agents-md.ts` calls
`require.resolve('next/package.json', { paths: [cwd] })` and never falls back to the
`next` entry in `package.json` dependencies, so the emitted command cannot be
self-healing in a checkout where `node_modules` is absent.

Verified with `@next/codemod@16.3.1`, next `16.1.6`, Node 24.
