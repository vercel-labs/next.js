# Repro: `pnpm i` fails with "packages field missing or empty" on pnpm 10.0–10.4

Issue: https://github.com/vercel/next.js/issues/91954

`create-next-app` writes `pnpm-workspace.yaml` **without** a `packages:` key for any
pnpm major >= 10
([templates/index.ts](https://github.com/vercel/next.js/blob/canary/packages/create-next-app/templates/index.ts)),
but pnpm only made `packages` optional in **10.5.0**. On pnpm 10.0.x–10.4.x every
subsequent command in the generated app fails.

## Run

```bash
bash repro.sh            # uses pnpm 10.4.1 -> fails
PNPM_VERSION=10.5.0 bash repro.sh   # passes
```

## Observed (pnpm 10.4.1)

Generated `pnpm-workspace.yaml`:

```yaml
ignoredBuiltDependencies:
  - sharp
  - unrs-resolver
```

```
$ pnpm i
 ERROR  packages field missing or empty
For help, run: pnpm help install
```

Adding `packages: ["."]` to the generated file makes `pnpm i` succeed.

`generated-package.json` / `generated-pnpm-workspace.yaml` are the verbatim files
produced by `create-next-app@latest` (next 16.3.1) under pnpm 10.4.1.
