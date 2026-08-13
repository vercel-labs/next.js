// Syntax-checks every emitted client chunk with `node --check`.
// Exits 1 (and prints the offending file) when a chunk is not valid JavaScript.
import { readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const dir = '.next/static/chunks';
let failed = 0;
for (const name of readdirSync(dir)) {
  if (!name.endsWith('.js')) continue;
  const file = join(dir, name);
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  } catch (err) {
    failed++;
    const out = String(err.stderr).split('\n').filter((l) => l.includes('Error')).join('\n');
    console.error(`PARSE FAIL: ${file}\n${out}`);
  }
}
console.log(failed ? `${failed} chunk(s) failed to parse` : 'all chunks parse OK');
process.exit(failed ? 1 : 0);
