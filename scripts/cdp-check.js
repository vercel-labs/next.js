// Connects to a node --inspect target (same protocol VS Code's debugger uses),
// collects Debugger.scriptParsed events and reports scripts whose sourceMapURL
// is a relative .map path that does not exist on disk (=> "Could not read source map ... ENOENT").
const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');

const port = process.env.INSPECT_PORT || 9229;
const seconds = Number(process.env.CDP_SECONDS || 20);

async function main() {
  const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const target = list.find((t) => t.webSocketDebuggerUrl);
  console.log('attaching to', target.title, target.url);
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  const bad = new Map();
  let id = 0;
  ws.onopen = () => {
    ws.send(JSON.stringify({ id: ++id, method: 'Debugger.enable' }));
    ws.send(JSON.stringify({ id: ++id, method: 'Runtime.runIfWaitingForDebugger' }));
  };
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.method !== 'Debugger.scriptParsed') return;
    const { url, sourceMapURL } = msg.params;
    if (!sourceMapURL || sourceMapURL.startsWith('data:') || !url.startsWith('file://')) return;
    const scriptPath = fileURLToPath(url);
    const resolved = path.resolve(path.dirname(scriptPath), decodeURIComponent(sourceMapURL));
    if (!fs.existsSync(resolved)) bad.set(`${url}|${sourceMapURL}`, { url, sourceMapURL, resolved });
  };
  await new Promise((r) => setTimeout(r, seconds * 1000));
  if (!bad.size) { console.log('no broken sourceMapURLs seen'); process.exit(0); }
  console.log(`\n${bad.size} script(s) reported a sourceMapURL that does not exist:\n`);
  for (const b of bad.values()) {
    console.log(`Could not read source map for ${b.url}: ENOENT: no such file or directory, open '${b.resolved}'`);
  }
  process.exit(1);
}
main();
