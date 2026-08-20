# Repro: next.js#60030 — withMDX ignores config when nextConfig is a function

`@next/mdx`'s plugin does `{ ...inputConfig }`. When `inputConfig` is a *function*
(the documented phase-based config form), spreading it yields `{}`, so every user
option (here `output: 'export'`) is silently dropped.

## Run

```bash
npm install
npx next build        # withMDX(fn)  -> NO `out/` directory (bug)
cp next.config.fn-only.js next.config.js && rm -rf .next && npx next build
                      # plain fn     -> `out/` directory is produced (expected)
```

Quick proof without a build:

```bash
node -e "console.log(JSON.stringify(require('@next/mdx')()((p,c)=>({output:'export'}))))"
# => {}
```
