# Reproduction attempt for vercel/next.js#57652

Docs question: "transitions must be synchronous, so how do we call Server Actions
(Server Functions) from `startTransition`? Is a transition even required?"

## What this checks

`app/client.tsx` invokes the same Server Function (`app/actions.ts`) four ways:

- `A` module-level `startTransition` with a synchronous callback that kicks off the promise
- `B` module-level `startTransition` with an `async` callback
- `C` `useTransition()`'s `startTransition` with an `async` callback
- `D` plain `onClick` handler, no transition at all

## Run

```bash
npm install
npm run build      # includes `next build` type checking
npm start          # then click the four buttons on http://localhost:3000
node t.mjs         # optional: Playwright script that clicks all four buttons
```

## Result (Next.js 16.3.1, react/react-dom 19, @types/react 19.2.18)

`next build` type checking passes (no `VoidOrUndefinedOnly` error), and all four
buttons execute the Server Function successfully: the server logs
`[server action] addItem 42` four times and the client renders
`a:added:42 / b:added:42 / c:added:42 / d:added:42`.

## The reported TypeScript error is a @types/react@18 artifact

```bash
cd legacy-types-check && npm install && npm run check
```

With `@types/react@18` (including the latest 18.3.31):

```
check.tsx(9,52): error TS2322: Type 'Promise<void>' is not assignable to type 'VoidOrUndefinedOnly'.
check.tsx(10,42): error TS2322: Type 'Promise<void>' is not assignable to type 'VoidOrUndefinedOnly'.
check.tsx(11,46): error TS2345: Argument of type '() => Promise<void>' is not assignable to parameter of type 'TransitionFunction'.
```

The same file compiles cleanly with `@types/react@19`, which types
`startTransition` as accepting `() => void | Promise<void>`.
