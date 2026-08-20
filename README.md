# Repro: next.js#42846 — `AppType<P>` applies `P` to `pageProps` instead of the App's own props

`AppType<P = {}> = NextComponentType<AppContextType, P, AppPropsType<any, P>>`
(`next/dist/shared/lib/utils.d.ts`) forwards the generic to `AppPropsType`'s
`PageProps`, so the type parameter lands on `props.pageProps` instead of being
merged into the App component's own props.

## Run

```bash
npm install
npx tsc --noEmit   # bug: error on pages/_app.tsx line 13 (props.foo)
npm run dev        # runtime: props.foo IS set, props.pageProps is undefined
curl -s localhost:3000/
```

## Observed (next 16.3.1-canary.25, typescript 7.0.2)

```
pages/_app.tsx(13,53): error TS2339: Property 'foo' does not exist on type 'AppPropsType<any, MyInitialProps>'.
```

while HTML shows `props.foo = "from-getInitialProps"` and `props.pageProps.foo = ` (undefined),
i.e. the accepted expression (`props.pageProps.foo`) is the one that does not exist at runtime.
