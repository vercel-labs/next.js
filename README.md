# Repro: `useParams<Interface>()` fails TS2344 (vercel/next.js#61951)

`useParams<T extends Params = Params>()` where `Params = Record<string, ParamValue>`
rejects an `interface` (no implicit index signature) while an equivalent `type` alias is accepted.

## Run

```bash
npm install
npm run typecheck
```

Expected: no errors.
Actual: `components/client.tsx(18,28): error TS2344: Type 'PageParams' does not satisfy the constraint 'Params'. Index signature for type 'string' is missing in type 'PageParams'.`
The identical object shape declared as `type PageParamsType = {...}` produces no error.
