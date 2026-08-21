# Reproduction for vercel/next.js#78924 — `Error: {}` from a Server Component render

Minimal reproduction of the "Turbopack and React Compiler sometimes crashes and returns an
Empty Object" symptom: the dev overlay / terminal report `Error: {}` (empty object, no
message, no application stack frame) and
`Switched to client rendering because the server rendering errored: {}`.

## Run

```bash
npm install
npm run dev          # next dev --turbopack, reactCompiler enabled
# open http://localhost:3000/dashboard
```

## What happens

`app/dashboard/preview-button.jsx` is a **synchronous Server Component** that consumes a
promise with `use()` (same shape as `PreviewLinksButton` in the reporter's app). The data
function rejects with a **non-`Error` value** (`throw {}` — what several drivers/libraries do
on transient failures).

Observed:

* terminal: `⨯ [Error: {}] { digest: '...' }`
* dev overlay: `Runtime Error / Server / Error: {}`, pointing at
  `app/dashboard/layout.jsx (6:7) @ DashboardLayout` (the `<Navbar />` line), with every
  other frame ignore-listed — i.e. no pointer to the code that actually threw.
* browser: `Switched to client rendering because the server rendering errored: {}`

Expected: the overlay should attribute the error to the throwing module/component (or say
that a non-Error value was thrown there), instead of surfacing `{}` at the consuming layout.

Cause of the message: `react-server-dom-*`'s `emitErrorChunk` builds the flight error row
with `describeObjectForErrorMessage(value)` (`{}`) and `stack: []` when the thrown value is
not an `Error`, so all source information is lost.

## Contrast

`app/reject-async/page.jsx` throws a real `Error` from an async Server Component — that one
is reported perfectly, with file/line of the `throw`. The difference is only the thrown value.

## Matrix (all show `Error: {}`)

| Next | bundler | reactCompiler | result |
| --- | --- | --- | --- |
| 15.3.2 | Turbopack | on | `Error: {}`, no app frame |
| 15.3.2 | webpack (`npm run dev:webpack`) | off | `Error: {}`, no app frame |
| 16.3.1-canary.26 | Turbopack | on | overlay shows `{}`, no app frame |

So the unhelpful empty-object error is not specific to Turbopack or the React Compiler.
