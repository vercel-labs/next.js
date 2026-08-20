# Repro: next.js#53807 — Babel `compact` option ignored by Next.js babel loader

The `[BABEL] Note: The code generator has deoptimised the styling of ... as it exceeds the max of 500KB.`
log cannot be silenced with the Babel `compact` option, because
`packages/next/src/build/babel/loader/get-config.ts` only forwards
`plugins`, `presets`, `target`, `env` and `overrides` from the user's Babel config.

## Steps

```bash
npm install
npx next build
```

`.babelrc` contains `"compact": true`, yet the build still prints:

```
Using external babel configuration from /path/.babelrc
[BABEL] Note: The code generator has deoptimised the styling of lib/big-generated-file.js as it exceeds the max of 500KB.
```

`lib/big-generated-file.js` is a generated ~670 KB module imported by `pages/index.js`.

## Control

`node control-check.js` calls Next.js' bundled Babel directly: with `compact: 'auto'`
(the effective default in the loader) the note is printed, with `compact: true` it is not.
So the option works — Next.js simply drops it.
