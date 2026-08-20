# Repro: next.js#69070 — unreachable dynamic `import()` causes "Module not found" (webpack)

```
npm install
npx next build --webpack   # FAILS: Module not found: Can't resolve 'this-module-does-not-exist'
npx next build             # Turbopack: succeeds
```

Node executes the same code fine (`node -e` with the arrow function returns `false`).
