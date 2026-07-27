import { createServer } from "node:http";

const PORT = 3001;

const server = createServer((req, res) => {
  const traceparent = req.headers["traceparent"];
  const tracestate = req.headers["tracestate"];

  if (traceparent) {
    console.log(`\x1b[32m✅ traceparent: ${traceparent}\x1b[0m`);
  } else {
    console.log(`\x1b[31m❌ traceparent: MISSING\x1b[0m`);
  }
  if (tracestate) {
    console.log(`   tracestate:  ${tracestate}`);
  }

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      ok: true,
      hasTraceparent: !!traceparent,
      traceparent: traceparent ?? null,
    })
  );
});

server.listen(PORT, () => {
  console.log(`Downstream server listening on http://localhost:${PORT}`);
  console.log("Waiting for requests...\n");
});
