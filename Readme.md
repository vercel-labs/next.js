# Reproduction for vercel/next.js#73817

Issue: the "Read more" link in the `InlineUseServerInClientComponent` compile error pointed to
a docs anchor that does not exist (`...server-actions#with-client-components`).

Run:

    npm install
    npx next build

Result on next@canary (16.3.1-canary.11): the error now links to
https://nextjs.org/docs/app/api-reference/directives/use-server#using-server-functions-in-a-client-component
which resolves to a real heading (verified HTTP 200 + `id="using-server-functions-in-a-client-component"`).

Pinning next@15.1.0 (the reported version) instead reproduces the original bad link:
`https://nextjs.org/docs/app/api-reference/functions/server-actions#with-client-components`.

Extra observation: putting the inline `'use server'` directive in the *same* file as the
`"use client"` directive makes canary report an unrelated error instead:
`The "use client" directive must be placed before other expressions.`
