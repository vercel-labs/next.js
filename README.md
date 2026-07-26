Minimal reproduction for a Next.js Dev Overlay bug: a plain object passed to `console.error`
always renders as an empty `{}`, regardless of its actual properties.

## Bug

`console.error({ a: 1, b: 2 })` — see [`app/page.tsx`](./app/page.tsx) — should show
`{a: 1, b: 2}` in the Dev Overlay's Console Error panel, the same way it does in the
browser's native devtools console.

Instead, it always renders as `{}`.

Root cause: `formatObject` in
[`packages/next/src/client/lib/console.ts`](https://github.com/vercel/next.js/blob/canary/packages/next/src/client/lib/console.ts)
looks up each property descriptor with the literal string `'key'` instead of the loop
variable `key`, so the descriptor lookup never matches a real property and the loop body
never runs.

## Steps to reproduce

1. `pnpm install`
2. `pnpm dev`
3. Open the app in a browser
4. Open the Dev Overlay and expand the "Console Error" entry

## Expected vs. actual

- Expected: `{a: 1, b: 2}`
- Actual: `{}`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [How to Contribute to Open Source (Next.js)](https://www.youtube.com/watch?v=cuoNzXFLitc) - a video tutorial by Lee Robinson
- [Triaging in the Next.js repository](https://github.com/vercel/next.js/blob/canary/contributing.md#triaging) - how we work on issues
- [CodeSandbox](https://codesandbox.io/s/github/vercel/next.js/tree/canary/examples/reproduction-template) - Edit this repository on CodeSandbox

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deployment

If your reproduction needs to be deployed, the easiest way is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
