// Reproduces vercel/next.js#94075 without a device/WebView.
// Starts `next dev`, then requests a page chunk the way a cross-origin
// WebView does (Origin: http://127.0.0.1:PORT and Origin: null).
// Next.js <= 16.1.7: 200 (only a warning)  ->  React hydrates
// Next.js >= 16.2.0: 403 "Unauthorized"    ->  no client JS, no hydration
import { spawn } from "node:child_process";

const PORT = process.env.PORT || "3000";
const base = `http://localhost:${PORT}`;

const dev = spawn("./node_modules/.bin/next", ["dev", "--hostname", "0.0.0.0", "-p", PORT], {
  env: { ...process.env, TAURI_DEV_HOST: "localhost", PORT },
  stdio: ["ignore", "inherit", "inherit"],
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  let html = "";
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`${base}/`);
      html = await res.text();
      if (res.ok) break;
    } catch {}
    await sleep(1000);
  }
  const chunk = html.match(/src="(http:\/\/[^"]*page_tsx[^"]*)"/)?.[1];
  if (!chunk) throw new Error("could not find the page chunk in the HTML");
  console.log(`\nchunk: ${chunk}`);
  for (const origin of [`http://127.0.0.1:${PORT}`, "null"]) {
    const res = await fetch(chunk, { headers: { Origin: origin } });
    const body = (await res.text()).slice(0, 40);
    console.log(`Origin: ${origin} -> ${res.status} ${JSON.stringify(body)}`);
  }
} finally {
  dev.kill("SIGKILL");
}
