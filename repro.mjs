// Sends a Server Action request exactly like a Codespaces / dev tunnel proxy does.
// Expect: HTTP 500 + "Invalid Server Actions request." and a server log line
// "`x-forwarded-host` header with value `...devtunnels.ms` does not match `origin` header ...".
const port = process.env.PORT ?? 3000;
const res = await fetch(`http://localhost:${port}/`, {
  method: "POST",
  headers: {
    "Content-Type": "text/plain;charset=UTF-8",
    Origin: `http://localhost:${port}`,
    "x-forwarded-host": process.env.TUNNEL_HOST ?? "abc123-3000.use.devtunnels.ms",
    "Next-Action": "0000",
  },
  body: "[]",
});
console.log("status:", res.status);
console.log((await res.text()).slice(0, 300));
