# Repro: next.js#64540 — redirect() swallowed by try/catch in Route Handlers

Next.js 16.3.1 (also applies to 14/15). `npm install && npm run dev`

| Route | Code | Result |
| --- | --- | --- |
| `/example-ok` | `redirect()` outside try/catch | 307 -> `/target` (correct) |
| `/example-catch` | `redirect()` inside `try`, `catch` returns a Response | 500 "caught error"; caught error message is only `NEXT_REDIRECT`, no Next.js warning |
| `/example-swallow` | `redirect()` inside `try`, `catch {}` swallows | 500 "No response is returned from route handler" |
| `/example-rethrow` | `catch (e) { unstable_rethrow(e) }` | 307 -> `/target` (workaround docs should show) |

Docs page that lacks this note: https://nextjs.org/docs/app/api-reference/functions/redirect
