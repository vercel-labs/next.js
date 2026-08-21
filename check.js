// Browser check: renders the proxied /login route and prints what the user sees.
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const r = await p.goto("http://127.0.0.1:8080/login", { waitUntil: "load" });
  console.log("status", r.status(), "content-type", r.headers()["content-type"], "cache", r.headers()["x-proxy-cache"]);
  console.log("visible text:", JSON.stringify((await p.innerText("body")).slice(0, 200)));
  await p.screenshot({ path: "login-broken.png", fullPage: true });
  await b.close();
})();
