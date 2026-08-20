// Reproduces https://github.com/vercel/next.js/issues/69068
// Runs the TypeScript language server (what your editor runs) against two files
// that use the identical "~/*" tsconfig path alias.
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const tsserver = require.resolve("typescript/lib/tsserver.js");
const root = process.cwd();
const files = [
  path.join(root, "src/app/page.tsx"),
  path.join(root, "src/app/.well-known/route.ts"),
];

const proc = spawn(process.execPath, [tsserver, "--disableAutomaticTypingAcquisition"], { cwd: root });
let seq = 1;
const pending = new Map();
const send = (command, args) => {
  const s = seq++;
  proc.stdin.write(JSON.stringify({ seq: s, type: "request", command, arguments: args }) + "\n");
  return new Promise((res) => pending.set(s, res));
};
let buf = "";
proc.stdout.on("data", (d) => {
  buf += d;
  const lines = buf.split("\n");
  buf = lines.pop() ?? "";
  for (const line of lines) {
    if (!line.startsWith("{")) continue;
    let m; try { m = JSON.parse(line); } catch { continue; }
    if (m.type === "response" && pending.has(m.request_seq)) {
      pending.get(m.request_seq)(m.body);
      pending.delete(m.request_seq);
    }
  }
});

let failed = false;
for (const file of files) {
  await send("open", { file });
  const info = await send("projectInfo", { file, needFileNameList: false });
  const diags = await send("semanticDiagnosticsSync", { file });
  const rel = path.relative(root, file);
  console.log(`\n${rel}`);
  console.log(`  project: ${info.configFileName}`);
  if (!diags?.length) console.log("  diagnostics: none");
  for (const d of diags) {
    console.log(`  TS${d.code} at ${d.start.line}:${d.start.offset} - ${d.text}`);
    if (d.code === 2307) failed = true;
  }
}
console.log(
  failed
    ? "\nREPRODUCED: the file inside the dot-prefixed route directory is not part of tsconfig.json's program, so path aliases fail (TS2307)."
    : "\nNOT REPRODUCED: no TS2307 reported."
);
proc.kill();
process.exit(failed ? 1 : 0);
