# Repro: inaccurate source-map `names` for minified bindings (next.js#80720)

Minimal reproduction of https://github.com/vercel/next.js/issues/80720 (originally
reported against the app-router-playground).

A server component renders `products.map((product) => ...)`. In the webpack
production build the callback parameter is minified to `a`. The generated source
map maps that binding to the wrong column (the `(` before `product`) and emits
**no** `name`, even though `"product"` is present in the map's `names` array and
the *usages* (`a.name`, `a.id`) do resolve to `product`.

## Run

```bash
pnpm install
pnpm build     # next build --webpack
pnpm check     # decodes .next/server/app/page.js.map
```

`pnpm check` exits 1 and prints:

```
generated identifier : "a"
mapped source        : webpack://.../app/page.tsx
mapped orig position : line 9, column 16
mapped name          : "map"
original source line : "      {products.map((product) => ("
FAIL: minified a has no original name (expected "product")
```

Raw mappings around the callback (webpack, next 16.3.1-canary.26):

```
gen 1:1586 orig 9:16  name "map"      map(a=>(0,d.
gen 1:1590 orig 9:20  name null       a=>(0,d.jsx)   <-- binding `a`, expected orig 9:21 name "product"
gen 1:1617 orig 10:29 name "product"  a.name},a.id
gen 1:1625 orig 10:16 name "product"  a.id))})}}
```

Turbopack (`next build --turbopack`) does not emit a comparable minified server
chunk for this page, so the check script only applies to the webpack build.
