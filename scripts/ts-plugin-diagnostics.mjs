// Drives tsserver with the Next.js TypeScript plugin (tsconfig "plugins": [{ "name": "next" }])
// the same way an editor does, and prints the semantic diagnostics for the given files.
import { spawn } from "node:child_process"
import { createRequire } from "node:module"
import path from "node:path"
import fs from "node:fs"

const require = createRequire(import.meta.url)
const tsserver = require.resolve("typescript/lib/tsserver.js")
const root = process.cwd()
const files = (process.argv.slice(2).length ? process.argv.slice(2) : ["components/child.tsx", "components/chat.tsx"]).map(
  f => path.resolve(root, f)
)

const proc = spawn(process.execPath, [tsserver, "--disableAutomaticTypingAcquisition"], { stdio: ["pipe", "pipe", "inherit"] })
let seq = 0
const send = (command, args) => {
  const msg = JSON.stringify({ seq: ++seq, type: "request", command, arguments: args })
  proc.stdin.write(`${msg}\n`)
}

let buf = ""
proc.stdout.on("data", chunk => {
  buf += chunk.toString()
  let idx
  while ((idx = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, idx).trim()
    buf = buf.slice(idx + 1)
    if (!line.startsWith("{")) continue
    const msg = JSON.parse(line)
    if (msg.command === "semanticDiagnosticsSync") {
      const file = pending.shift()
      const diags = msg.body ?? []
      console.log(`\n=== ${path.relative(root, file)} ===`)
      if (!diags.length) console.log("  (no diagnostics)")
      for (const d of diags) {
        const loc = d.startLocation ? `${d.startLocation.line}:${d.startLocation.offset}` : `${d.start?.line}:${d.start?.offset}`
        console.log(`  line ${loc} [${d.category}] ts(${d.code}) ${d.message ?? d.text}`)
      }
      if (!pending.length) {
        proc.stdin.end()
        setTimeout(() => process.exit(0), 100)
      }
    }
  }
})

const pending = [...files]
send("configure", { hostInfo: "vscode", preferences: {} })
for (const file of files) {
  send("open", { file, fileContent: fs.readFileSync(file, "utf8"), scriptKindName: "TSX", projectRootPath: root })
}
for (const file of files) send("semanticDiagnosticsSync", { file, includeLinePosition: true })
