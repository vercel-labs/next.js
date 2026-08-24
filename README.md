# Minimal reproduction — Turbopack 7-char chunk-name hash collision (vercel/next.js#97765)

Two files, two dynamic imports. No 120k-file generator, no 12 GB build.

```bash
npm install
npx next build   # fails, deterministically
```

```
Error: Turbopack build failed with 2 errors:
[output]/.next/server/chunks/src_gen_m_1u45-ck.js
Error: Two or more assets with different content were emitted to the same output path
file content differs, written to:
  [output]/.next/743b09da94779993.js
  [output]/.next/dfe92e4450f1b1df.js
```

## Why two imports are enough

`AssetIdent::output_name` (`turbopack/crates/turbopack-core/src/ident.rs`) appends the
ident hash truncated to **7 base38 chars**. For a Turbopack Node build chunk the hashed
input is exactly:

```
xxh3_64( 2u8 | dh("chunk item") | dh("<chunk item ident string>") | 3u8 | dh("ecmascript build node chunk") )
```

where the chunk item ident string here is `[project]/src/gen/m.js?q<N> [app-route] (ecmascript)`.
`tools/find-collision.mjs` reimplements that hash in JS, verifies it against real emitted
chunk names, and searches query strings for 7-char collisions:

```bash
node tools/find-collision.mjs   # needs the devDependency @node-rs/xxhash
# q73518 / q102901 -> 1u45-ck   (the same pair the 120k-file repro in #97765 hits)
```

So the collision reported in #97765 is not a property of large trees — large trees only
make it *likely*. Any two idents that share a name prefix and collide in 36 bits fail.

Verified failing on next@16.2.9 and next@16.4.0-canary.3.
