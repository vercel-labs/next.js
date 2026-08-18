# `next upgrade` fails behind a minimum-release-age registry gate

Reproduction for https://github.com/vercel/next.js/issues/97521

`age-gate-registry.mjs` is a ~40 line stand-in for a proxy registry (verdaccio /
Artifactory / dependency-firewall) that enforces a *minimum release age*: every
version published less than `MIN_AGE_DAYS` (default 7) ago is removed from the
packument, while `dist-tags` are proxied unchanged. This is exactly what such
gates do in practice.

## Run

```bash
npm run repro          # or: MIN_AGE_DAYS=7 ./repro.sh
```

## Observed

1. `npx next upgrade` dies before doing anything:

```
npm error code ETARGET
npm error notarget No matching version found for @next/codemod@16.3.1-canary.23.
```

   `packages/next/src/cli/next-upgrade.ts` hardcodes `@next/codemod@canary`, and the
   `canary` dist-tag always points at a package published hours ago, so it is always
   inside the age window.

2. Even with an installable codemod, `upgrade latest` fails because the `latest`
   dist-tag points at a gated version:

```
Invalid revision provided: "latest" (resolved to "latest").
```

   (`next upgrade minor|patch`, i.e. semver ranges, still work: npm falls back to the
   newest non-gated version.)

## Expected

`next upgrade` should be able to run against a registry with a release-age gate,
e.g. by falling back to the newest installable `@next/codemod` (a range such as
`@next/codemod@^16` instead of the `canary` tag) and by resolving dist-tags to the
newest version the configured registry actually serves.
