import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const label = process.argv[2]; // e.g. bun-turbopack
const cmd = process.argv[3]; // shell command
const port = process.argv[4] || '3000';

const ART = '/workspace/.next-maintainer/reproduction-artifacts';
const logPath = path.join(ART, 'next-server', `${label}.log`);
const logStream = fs.createWriteStream(logPath);

const proc = spawn('bash', ['-lc', cmd], {
  cwd: '/workspace/repro',
  env: { ...process.env, PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}`, PORT: port },
});
proc.stdout.pipe(logStream);
proc.stderr.pipe(logStream);

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForServer() {
  for (let i = 0; i < 120; i++) {
    try {
      const res = await fetch(`http://localhost:${port}/en`);
      if (res.status < 500) return true;
    } catch {}
    await wait(1000);
  }
  return false;
}

const target = process.argv[5] || '/workspace/repro/app/[locale]/page.tsx';
const original = fs.readFileSync(target, 'utf8');

const results = [];
try {
  if (!(await waitForServer())) throw new Error('server did not start');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const events = [];
  page.on('console', (m) => {
    const t = m.text();
    if (t.includes('Fast Refresh')) events.push({ t, ts: Date.now() });
  });
  await page.goto(`http://localhost:${port}/en`, { waitUntil: 'load', timeout: 120000 });
  await wait(15000);
  events.length = 0;

  for (let edit = 1; edit <= 4; edit++) {
    const before = events.length;
    fs.writeFileSync(target, original + '\n// edit ' + 'x'.repeat(edit) + '\n');
    await wait(20000);
    const got = events.slice(before);
    const rebuilding = got.filter((e) => /rebuilding/i.test(e.t)).length;
    const done = got.filter((e) => /done in/i.test(e.t)).length;
    results.push({ edit, rebuilding, done, msgs: got.map((e) => e.t) });
    console.log(`[${label}] edit ${edit}: rebuilding=${rebuilding} done=${done}`);
  }
  await page.screenshot({ path: path.join(ART, 'playwright', `${label}.png`), fullPage: false });
  await browser.close();
} catch (e) {
  console.error('ERROR', e.message);
} finally {
  fs.writeFileSync(target, original);
  fs.writeFileSync(path.join(ART, `${label}-results.json`), JSON.stringify(results, null, 2));
  proc.kill('SIGKILL');
  await wait(1000);
  process.exit(0);
}
