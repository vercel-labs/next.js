// Simulates a JS-disabled browser: replays each <form>'s own hidden $ACTION_*
// fields as a plain multipart POST to the page URL (no Next-Action header).
const base = process.env.URL || "http://localhost:3000";
const html = await (await fetch(base + "/")).text();

const forms = html.match(/<form[\s\S]*?<\/form>/g) ?? [];
const unesc = (s) => s.replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#x27;/g, "'");

for (const form of forms) {
  const id = /id="([^"]+)"/.exec(form)?.[1] ?? "?";
  const fd = new FormData();
  for (const input of form.match(/<input[^>]*>/g) ?? []) {
    const tag = unesc(input);
    const name = /name="([^"]*)"/.exec(tag)?.[1];
    const value = /value="([\s\S]*)"\s*\/?>/.exec(tag)?.[1] ?? "";
    if (name) fd.append(name, value);
  }
  const t = Date.now();
  try {
    const res = await fetch(base + "/", { method: "POST", body: fd, signal: AbortSignal.timeout(15000) });
    const body = await res.text();
    console.log(`${id.padEnd(8)} RESPONDED ${Date.now() - t}ms ${res.status} ${body.length} bytes`);
  } catch (e) {
    console.log(`${id.padEnd(8)} HELD - no response after ${Date.now() - t}ms (${e.name})`);
  }
}
