# Reproduction: URLSearchParams does not survive serialization to a Server Action (#71078)

Passing a `URLSearchParams` instance from a client component to a Server Action
deserializes it as a 2-dimensional array on the server.

## Run

```bash
npm install
npm run dev   # or: npm run build && npm start
```

Open http://localhost:3000 and click "Call server action".

Observed (next 16.3.1, dev and prod):

```json
{
  "ctor": "Array",
  "isURLSearchParams": false,
  "toString": "foo,bar,next,js",
  "json": "[[\"foo\",\"bar\"],[\"next\",\"js\"]]"
}
```

Expected: either `foo=bar&next=js` (a real `URLSearchParams`) or a
serialization error/warning, as with other non-serializable values.
