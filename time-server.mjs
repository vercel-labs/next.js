// Stand-in for the external tagged fetch used in the original report
// (https://worldtimeapi.org/api/ip). Serves the current unix time on :3999.
import http from "node:http";
http
  .createServer((_, res) => {
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ unixtime: Math.floor(Date.now() / 1000) }));
  })
  .listen(3999, () => console.log("time server on http://localhost:3999"));
