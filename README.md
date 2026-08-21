# Repro: `@next/swc-*` native binary is duplicated per project (#79770)

Issue: https://github.com/vercel/next.js/issues/79770

The reporter's linked repo (`RodrigoTomeES/bug-nextjs-api-polyfill`) is unrelated to the
report; the report itself is "install Next.js in any project and observe the size of the
platform `@next/swc-*` native binary". This repro does exactly that, twice, and measures it.

## Run

```bash
npm run repro
```

## Observed (Linux x64, npm 11, next 16.3.1)

```
next 16.3.1
app-one/node_modules            327M
app-two/node_modules            327M
@next/swc-linux-x64-gnu          93M   (96,738,472 bytes) per project
inode=123693 links=1  /  inode=17344739 links=1   -> two independent copies
md5 identical (9a7e5b20fb36cc44aaa8040612bcdea6)
```

Byte-identical ~92 MiB binaries are stored once per project; npm has no shared
global content store, so N Next.js projects cost N x ~92 MiB (plus ~230 MiB of
other deps). `next/package.json` lists all 8 `@next/swc-*` platform packages as
`optionalDependencies`, so only the matching one is installed, but it is never
shared across projects.
