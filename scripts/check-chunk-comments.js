// Fails if a webpack server chunk contains a bare `//# sourceMappingURL=<name>.js.map`
// comment whose target does not exist next to the chunk. This is what makes the
// VS Code / node debugger log "Could not read source map ... ENOENT".
const fs = require('fs');
const path = require('path');

const roots = ['.next/server', '.next/dev/server'];
let bad = 0;
for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.js')) {
        const lines = fs.readFileSync(p, 'utf8').split('\n');
        lines.forEach((line, i) => {
          const m = /^\s*\/\/[#@]\s*sourceMappingURL=(\S+\.map)\s*$/.exec(line);
          if (!m) return;
          const target = path.resolve(path.dirname(p), m[1]);
          if (!fs.existsSync(target)) {
            bad++;
            console.log(`${p}:${i + 1}  //# sourceMappingURL=${m[1]}  -> missing ${target}`);
          }
        });
      }
    }
  };
  walk(root);
}
console.log(`\nbare sourceMappingURL comments pointing at missing files: ${bad}`);
process.exit(bad > 0 ? 1 : 0);
