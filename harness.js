// Deterministic harness for vercel/next.js#69682
// Restarts `next dev` with a cold .next N times and checks, per cold start, whether:
//  - the client `TestProvider` console.log runs (i.e. React hydrated), and
//  - /_next/static/chunks/app/layout.js is served with a complete body.
// Usage: node harness.js [iterations] [startPort]  (iteration N uses startPort + N - 1)
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ITER = Number(process.argv[2] || 6);
const PORT = Number(process.argv[3] || 3000);
const OUT = path.join(__dirname, 'harness-out');

function waitReady(logFile) {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const t = setInterval(() => {
      const txt = fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8') : '';
      if (/Ready in|ready started/.test(txt)) { clearInterval(t); resolve(); }
      else if (Date.now() - started > 120000) { clearInterval(t); reject(new Error('dev server not ready')); }
    }, 500);
  });
}

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  const results = [];
  for (let i = 1; i <= ITER; i++) {
    fs.rmSync(path.join(__dirname, '.next'), { recursive: true, force: true });
    const logFile = path.join(OUT, `dev-${i}.log`);
    const out = fs.openSync(logFile, 'w');
    const port = PORT + i - 1; // fresh port per iteration so a lingering child can never block the next run
    const dev = spawn('npx', ['next', 'dev', '--port', String(port)], { cwd: __dirname, stdio: ['ignore', out, out], detached: true });
    try { await waitReady(logFile); } catch (e) { console.log(`iteration ${i}: ${e.message}`); try { process.kill(-dev.pid, 'SIGKILL'); } catch {} continue; }

    const browser = await chromium.launch();
    const page = await browser.newPage();
    const logs = [];
    let layoutChunk = null;
    page.on('console', (m) => logs.push(`[console.${m.type()}] ${m.text().slice(0, 200)}`));
    page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
    page.on('response', async (r) => {
      if (!/\/chunks\/app\/layout\.js/.test(r.url())) return;
      try { const b = await r.body(); layoutChunk = { status: r.status(), bytes: b.length }; } catch {}
    });
    try { await page.goto(`http://localhost:${port}/`, { waitUntil: 'load', timeout: 60000 }); }
    catch (e) { logs.push(`[goto-error] ${e.message}`); }
    await page.waitForTimeout(10000);
    const hydrated = await page.evaluate(() => Object.keys(document.body).some((k) => k.startsWith('__react'))).catch(() => false);
    await page.screenshot({ path: path.join(OUT, `iter-${i}.png`), fullPage: true });
    fs.writeFileSync(path.join(OUT, `iter-${i}.txt`), logs.join('\n'));
    await browser.close();
    try { process.kill(-dev.pid, 'SIGKILL'); } catch {}
    await new Promise((r) => setTimeout(r, 2000));

    const providerLog = logs.some((l) => l.includes('inside TestContext'));
    const parseError = logs.some((l) => /Invalid or unexpected token|SyntaxError/.test(l));
    results.push({ i, providerLog, hydrated, parseError, layoutChunk });
    console.log(`iteration ${i}: providerLog=${providerLog} hydrated=${hydrated} parseError=${parseError} layoutChunk=${JSON.stringify(layoutChunk)}`);
  }
  const bad = results.filter((r) => !r.providerLog);
  console.log(`\n${bad.length}/${results.length} cold starts failed to hydrate (expected: 0)`);
  process.exitCode = bad.length ? 1 : 0;
})();
