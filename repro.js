// One-shot reproduction: two static-export builds, then a client-side navigation
// against the older HTML => ChunkLoadError 404 => permanently blank page.
const { execSync } = require('child_process');
const fs = require('fs');
const run = (c) => execSync(c, { stdio: 'inherit' });

fs.rmSync('out-v1', { recursive: true, force: true });
fs.rmSync('out-v2', { recursive: true, force: true });

// build v1
fs.writeFileSync('app/page1/client.tsx', `"use client";\nexport default function Client(){return <p>client marker VERSION_ONE</p>;}\n`);
fs.rmSync('.next', { recursive: true, force: true });
run('npx next build --webpack');
fs.renameSync('out', 'out-v1');

// build v2 (only the page1 client component changed -> its chunk hash changes)
fs.writeFileSync('app/page1/client.tsx', `"use client";\nexport default function Client(){return <p>client marker VERSION_TWO_LONGER_MARKER</p>;}\n`);
fs.rmSync('.next', { recursive: true, force: true });
run('npx next build --webpack');
fs.renameSync('out', 'out-v2');

require('./server.js');
setTimeout(() => run('node test.js'), 500);
