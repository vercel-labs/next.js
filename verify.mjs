// Static verification of the Turbopack bug, run after `next build`.
import { readdirSync, readFileSync } from 'node:fs';
const dir = '.next/static/media';
const files = readdirSync(dir);
let bad = 0;
for (const f of files) {
  if (!f.endsWith('.mjs')) continue;
  const src = readFileSync(`${dir}/${f}`, 'utf8');
  for (const m of src.matchAll(/from\s*['"](\.\/[^'"]+)['"]/g)) {
    const spec = m[1].replace('./', '');
    const emitted = files.includes(spec);
    console.log(`${f}\n  imports ${JSON.stringify(m[1])} -> ${emitted ? 'OK' : 'MISSING in ' + dir + ' (404 at runtime)'}`);
    if (!emitted) bad++;
  }
}
console.log('\nemitted media files:\n  ' + files.filter((f) => f.endsWith('.mjs')).join('\n  '));
console.log(bad ? `\nFAIL: ${bad} dangling import(s) inside emitted worker asset(s)` : '\nPASS');
process.exit(bad ? 1 : 0);
