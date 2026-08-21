# Repro attempt for vercel/next.js#87766

useMemo returning JSX + early return + ternary, Next.js 16.1.1.

## Run
```
npm install
npx next build            # Turbopack: succeeds
npx next build --webpack  # webpack: succeeds
npx next dev              # / returns 200
```

Result: the snippet from the issue compiles successfully on 16.1.1 with both
bundlers; no "Unexpected token. Did you mean `{'}'}`" error.
