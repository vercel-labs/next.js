# Repro: vercel/next.js#73948

React Compiler + a newline inside a JSX string attribute of a Client Component => hydration mismatch in `next dev`.

## Run

```bash
npm install
npm run dev   # open http://localhost:3000
```

## Observed (next 15.1.0 / 15.5.23, reactCompiler: true)

- SSR HTML: `data-anything="bruh bruh"` (SWC collapses the newline + indentation to one space)
- Client (Babel react-compiler output): `data-anything="bruh\nbruh"`
- Console: "A tree hydrated but some attributes of the server rendered HTML didn't match the client properties" with
  `+ data-anything={"bruh\nbruh"}` / `- data-anything="bruh bruh"`

Removing the newline in `app/Hello.tsx` hydrates cleanly.

## Not reproducible on next 16.3.1

With `reactCompiler: true` on next 16.3.1 (Turbopack and `--webpack`), SSR emits the literal newline
(`data-anything="bruh\nbruh"`) and there is no hydration error — matching the SWC fix
(swc-project/swc#11550).
