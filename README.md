# Reproduction: next.js#97523

Route export validation (`.next/types/validator.ts`) rejects string-literal-union
dynamic params even when `generateStaticParams` is typed and `dynamicParams = false`.

```bash
npm install
npm run build   # fails in "Running TypeScript ..." with TS2344
```

Generated `.next/types/routes.d.ts` always widens the segment:

```ts
interface ParamMap {
  "/[locale]": { "locale": string; }
}
```
