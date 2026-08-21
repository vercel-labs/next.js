// Local verification of https://github.com/vercel/next.js/issues/83248
// 1. builds the app, 2. reports how many files were traced for the server,
// 3. runs the standalone server *outside* the repo (like a Vercel lambda,
//    where the project's own node_modules is not on the resolution path)
//    and requests /api/hello.
import { execSync } from 'node:child_process';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

execSync('next build', { stdio: 'inherit' });

const nft = JSON.parse(fs.readFileSync('.next/next-server.js.nft.json', 'utf8'));
const sourceMap = nft.files.filter((f) => f.includes('compiled/source-map'));
console.log(`\ntraced server files: ${nft.files.length}`);
console.log(`traced compiled/source-map entries: ${sourceMap.length}`);

if (!fs.existsSync('.next/standalone')) {
  console.log('\n.next/standalone was not even emitted -> build traces are broken.');
  console.log('This is the deploy-time shape of the bug: the serverless bundle is');
  console.log("missing next/dist/compiled/source-map, so the lambda throws");
  console.log("\"Cannot find module 'next/dist/compiled/source-map'\" and every API route 500s.");
  process.exit(0);
}

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'standalone-'));
fs.cpSync('.next/standalone', dir, { recursive: true });
fs.cpSync('.next/static', path.join(dir, '.next/static'), { recursive: true });
const child = spawn(process.execPath, ['server.js'], {
  cwd: dir,
  env: { ...process.env, PORT: '3999' },
  stdio: 'inherit',
});
await new Promise((r) => setTimeout(r, 5000));
try {
  const res = await fetch('http://127.0.0.1:3999/api/hello');
  console.log('\nGET /api/hello ->', res.status, await res.text());
} catch (err) {
  console.log('\nGET /api/hello -> server is not up:', err.message);
}
child.kill();
