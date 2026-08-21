# Reproduction for vercel/next.js#75374

Calling a Server Function (server action) during the render of a Client Component logs:

```
Cannot update a component (`Router`) while rendering a different component (`Demo`).
To locate the bad setState() call inside `Demo`, follow the stack trace as described in
https://react.dev/link/setstate-in-render
```

There is no explicit `setState` in `Demo`; the router's internal `useReducer` is dispatched
by the action queue when the action is invoked during render.

## Run

```bash
npm install
npx playwright install chromium
npm run dev        # then open http://localhost:3000
# or, headless console capture:
npm run check      # node check.mjs http://localhost:3000
```

## Observed

- Server render throws `Server Functions cannot be called during initial render.` and falls back to client rendering.
- Client render then logs the React error `Cannot update a component (Router) while rendering a different component (Demo)`.
- `next build` of this app fails while prerendering `/` with the same "cannot be called during initial render" error.

Confirmed with next@15.2.0-canary.27 (as reported) and next@16.3.1-canary.25.
