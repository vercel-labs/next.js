// Boots the counter endpoint + `next dev`, requests /photo/1 once, and reports how
// many backend requests the root layout made. Expected 1, observed 2 when @modal exists.
import { spawn } from 'node:child_process';
import { mkdirSync, createWriteStream } from 'node:fs';

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
mkdirSync('logs', { recursive: true });
const log = createWriteStream('logs/next-dev.log');

const counter = spawn('node', ['counter-server.js'], { stdio: 'inherit' });
const dev = spawn('npx', ['next', 'dev', '-p', '3000'], { stdio: ['ignore', 'pipe', 'pipe'] });
dev.stdout.pipe(process.stdout);
dev.stdout.pipe(log);
dev.stderr.pipe(process.stderr);
dev.stderr.pipe(log);

for (let i = 0; i < 60; i++) {
  try {
    await fetch('http://127.0.0.1:3000/');
    break;
  } catch {
    await wait(1000);
  }
}
await fetch('http://127.0.0.1:4000/reset');
await fetch('http://127.0.0.1:3000/photo/1');
await wait(2000);
const total = Number(await (await fetch('http://127.0.0.1:4000/count')).text());
const layout = total - 1; // one request comes from app/photo/[id]/page.jsx
console.log(`\n=== GET /photo/1 ===`);
console.log(`root layout backend requests: ${layout} (expected 1)`);
console.log(`total backend requests: ${total} (expected 2)`);
counter.kill();
dev.kill();
process.exit(layout > 1 ? 1 : 0);
