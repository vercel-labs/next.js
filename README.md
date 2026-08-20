# Reproduction for vercel/next.js#71358

`fs.readFileSync` of a `.handlebars` email template inside a `"use server"` Server Action.

```bash
npm install
# dev: works (reads from process.cwd())
npm run dev
# production: fails
npm run build && npm run start
```

Open http://localhost:3000 and click **read via __dirname (issue repro)**.

The template is at `lib/emails/reset-psw-req.handlebars`. In a production build `__dirname`
inside the bundled Server Action is not the source directory, so the read throws
`ENOENT`. On Vercel the file is also not part of the function's traced output, so
`process.cwd()`-based reads fail there too unless the file is imported or traced.
