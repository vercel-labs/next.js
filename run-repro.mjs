// One-command driver: launches headless Chrome with remote debugging and runs
// the hidden-document Suspense reveal probe (cdp-hidden-repro.mjs).
//
//   npm install && npm run build && npm start        # terminal 1
//   npm run repro                                    # terminal 2
//
// Set CHROME_PATH if Chrome/Chromium is not in a default location.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const PORT = process.env.CDP_PORT || '9444';
const CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  ...(fs.existsSync(path.join(os.homedir(), '.cache/ms-playwright'))
    ? fs
        .readdirSync(path.join(os.homedir(), '.cache/ms-playwright'))
        .filter((d) => d.startsWith('chromium-'))
        .map((d) => path.join(os.homedir(), '.cache/ms-playwright', d, 'chrome-linux64/chrome'))
    : []),
].filter(Boolean);
const chromePath = CANDIDATES.find((p) => fs.existsSync(p));
if (!chromePath) {
  console.error('No Chrome found. Set CHROME_PATH=/path/to/chrome');
  process.exit(1);
}
console.log('Using Chrome:', chromePath);

const child = spawn(
  chromePath,
  [
    '--headless=new',
    '--no-sandbox',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${fs.mkdtempSync(path.join(os.tmpdir(), 'repro-profile-'))}`,
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank',
  ],
  { stdio: ['ignore', 'ignore', 'ignore'] },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (let i = 0; i < 100; i++) {
  try {
    await fetch(`http://127.0.0.1:${PORT}/json/version`);
    break;
  } catch {
    await sleep(300);
  }
}

process.env.CDP_PORT = PORT;
try {
  await import('./cdp-hidden-repro.mjs');
} finally {
  child.kill();
}
