// Minimal local stand-in for worldtimeapi.org (unreachable in sandbox).
import { createServer } from "node:http";
createServer((_req, res) => {
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify({ datetime: new Date().toISOString() }));
}).listen(4000, () => console.log("data server on 4000"));
