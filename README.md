# Repro: `@next/env` has no ESM build (vercel/next.js#68091)

```bash
npm install
node script.js   # prints: cjs TEST = hello
node script.mjs  # SyntaxError: Named export 'loadEnvConfig' not found.
```

`@next/env` ships only a CJS bundle (`main: dist/index.js`, no `exports`/`module`
field), so Node's cjs-module-lexer cannot detect the named exports and
`import { loadEnvConfig } from "@next/env"` fails. `import nextEnv from "@next/env"`
works as a workaround.
