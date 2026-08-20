# Reproduction: middleware matcher does not support template literals (vercel/next.js#56398)

## Run

```sh
pnpm install
pnpm run dev   # or: pnpm run build
```

## Expected

A `config.matcher` entry built with a template literal from a module-level const
(common i18n pattern) is honored.

## Actual

Next.js warns and silently falls back to the default config, so the middleware
runs on every route:

```
 ⚠ Next.js can't recognize the exported `config` field in route "/middleware":
Unsupported template literal with expressions at "config.matcher[1]".
The default config will be used instead.
```
