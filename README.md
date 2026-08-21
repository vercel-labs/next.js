# next-swc styled-jsx infinite loop — vercel/next.js#97685

## Run

```sh
npm install
npm run build          # Turbopack: stops at "Creating an optimized production build ..." forever
npm run build:webpack  # same hang
npm run swc            # bundler-free: next-swc transform() never resolves (100% CPU)
```

`timeout 60 npm run swc` exits 124 instead of printing "transform finished".

## Trigger

Both of these must be present in the same component:

1. a local variable initialized from a **non-static** expression (`const Icon = t.icon`,
   or `const Icon = get()`) that is used as a **JSX element name** (`<Icon />`), and
2. a **dynamic interpolation** (`${...}`) inside `<style jsx>`.

Variants that compile fine (proving the pair is required):

- `const Icon = 'div'` (static init) + dynamic interpolation — OK
- `const Icon = t.icon` + static CSS (no `${}`) — OK
- `const Icon = t.icon` used as a value (`{String(Icon)}`) instead of a JSX element — OK
- plain `<style>` instead of `<style jsx>` — OK

## Versions

- next@14.2.33 — compiles (4 ms)
- next@15.0.0, 15.3.0, 15.5.4, 16.4.0-canary.0 — hangs forever
