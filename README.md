# Repro: next.js#97516 — SWC minifier emits duplicate `let` binding (SyntaxError: Identifier 'b' has already been declared)

```
npm install
npm run build            # Turbopack build
npm run build:webpack    # webpack build
```

Both fail during "Collecting page data" with `SyntaxError: Identifier 'b' has already been declared`.

Minified server chunk contains:

```js
a.map(a=>b=>{let b,c;return b=a.g,b+(c=b.l)})
```

The inner arrow parameter `b` collides with the hoisted `let b` the minifier introduced
(and the reference is also rewritten to the wrong binding). Building with `--no-mangling`
works. Reproducible with `@swc/core` `minify()` alone.
