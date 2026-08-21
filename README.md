# Repro: next/link JSX type error with `typedRoutes: true` (vercel/next.js#86156)

## Run

```
pnpm install
pnpm build
```

Build fails during "Running TypeScript" with:

```
./src/app/test/page.tsx:6:8
Type error: 'Link' cannot be used as a JSX component.
  Its type '<RouteType>(props: LinkProps<RouteType>) => Element' is not a valid JSX element type.
    Type '<RouteType>(props: LinkProps<RouteType>) => Element' is not assignable to type '(props: any) => ReactNode | Promise<ReactNode>'.
      Type 'Element' is not assignable to type 'ReactNode | Promise<ReactNode>'.
        Property 'children' is missing in type 'ReactElement<any, any>' but required in type 'ReactPortal'.
```

## Root cause

`typedRoutes` type generation (`packages/next/src/server/lib/router-utils/typegen.ts`) emits, into
`.next/types/link.d.ts` and `.next/dev/types/link.d.ts`:

```ts
export default function Link<RouteType>(props: LinkProps<RouteType>): JSX.Element
export default function Form<RouteType>(props: FormProps<RouteType>): JSX.Element
```

It references the **legacy global `JSX` namespace**. `@types/react@19` does not declare a global
`JSX` namespace, so in a clean React 19 app `JSX.Element` silently resolves to the error type
(`any`, hidden by `skipLibCheck`) and the build happens to pass.

As soon as *any* copy of `@types/react@18.0.x`/`18.2.x` is part of the program (very common: an old
transitive `@types/*` package that resolves its own `@types/react@^18`), the global `JSX` namespace
exists again and `JSX.Element` becomes React 18's `ReactElement<any, any>`, which is not assignable
to React 19's `ReactNode`. Every `<Link>` / `<Form>` usage then fails to type check.

This repo makes that deterministic with `"@types/legacy-react": "npm:@types/react@18.2.0"`
(a stand-in for such a transitive copy; it lands in `node_modules/@types`, which TypeScript
auto-includes).

Editing `.next/types/link.d.ts` to return `React.JSX.Element` instead of `JSX.Element` makes
`pnpm typecheck` / `next build` pass, confirming the generator is the problem.

Reproduced with next `16.0.3` and `16.3.1-canary.25`.
