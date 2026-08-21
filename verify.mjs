import fs from "node:fs";
import path from "node:path";
const dir = ".next/static";
const files = [];
(function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);e.isDirectory()?walk(p):p.endsWith(".js")&&files.push(p);}})(dir);
const re = /[{,]\s*(const|let|var|class|function|new|delete|in|default|catch|return|typeof|void|for|if|else|do|while|with|this|null|true|false|case|switch|throw|try|instanceof|export|import|extends|super|enum)\s*:/g;
let violations = 0;
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  let m;
  while ((m = re.exec(src))) {
    violations++;
    if (violations <= 15) console.log(`${f}: ${JSON.stringify(src.slice(Math.max(0,m.index-40), m.index+40))}`);
  }
}
console.log(`\nfiles scanned: ${files.length}\nunquoted reserved-word property keys: ${violations}`);
process.exit(violations ? 1 : 0);
