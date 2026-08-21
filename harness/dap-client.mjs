// Minimal DAP client that drives vscode-js-debug's standalone DAP server the
// same way VS Code's "JavaScript Debug Terminal" does: it launches a
// `node-terminal` session and handles the reverse `runInTerminal` request by
// spawning the command with the env vars js-debug injects (NODE_OPTIONS with the
// bootloader, VSCODE_INSPECTOR_OPTIONS, ...).
import net from 'node:net';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const command = process.argv[2]; // e.g. "bun run dev"
const cwd = process.argv[3];
const logPath = process.argv[4];
const port = Number(process.argv[5] || 4711);

const log = fs.createWriteStream(logPath, { flags: 'a' });
const socket = net.connect(port, '127.0.0.1');
let seq = 1;
function send(msg) {
  const body = JSON.stringify({ seq: seq++, ...msg });
  socket.write(`Content-Length: ${Buffer.byteLength(body)}\r\n\r\n${body}`);
  console.log('-> ', body.slice(0, 400));
}

let buf = Buffer.alloc(0);
socket.on('data', (chunk) => {
  buf = Buffer.concat([buf, chunk]);
  for (;;) {
    const idx = buf.indexOf('\r\n\r\n');
    if (idx < 0) return;
    const len = Number(/Content-Length: (\d+)/.exec(buf.slice(0, idx).toString())[1]);
    if (buf.length < idx + 4 + len) return;
    const msg = JSON.parse(buf.slice(idx + 4, idx + 4 + len).toString());
    buf = buf.slice(idx + 4 + len);
    handle(msg);
  }
});

function handle(msg) {
  if (msg.type === 'event' && msg.event === 'initialized') {
    send({ type: 'request', command: 'configurationDone', arguments: {} });
  }
  if (msg.type === 'event' && msg.event === 'output') {
    console.log('[dap output]', msg.body.category, (msg.body.output || '').trimEnd());
    return;
  }
  console.log('<- ', JSON.stringify(msg).slice(0, 600));
  if (msg.type === 'response' && msg.command === 'initialize') {
    send({
      type: 'request',
      command: 'launch',
      arguments: {
        type: 'pwa-node',
        request: 'launch',
        name: 'dev project',
        runtimeExecutable: command.split(' ')[0],
        runtimeArgs: command.split(' ').slice(1),
        program: undefined,
        console: 'integratedTerminal',
        cwd,
        __workspaceFolder: cwd,
      },
    });
  }
  if (msg.type === 'request' && msg.command === 'startDebugging') {
    send({ type: 'response', request_seq: msg.seq, success: true, command: 'startDebugging' });
  }
  if (msg.type === 'request' && msg.command === 'runInTerminal') {
    const a = msg.arguments;
    console.log('[runInTerminal] args=', JSON.stringify(a.args));
    console.log('[runInTerminal] env=', JSON.stringify(a.env, null, 2));
    const env = { ...process.env };
    for (const [k, v] of Object.entries(a.env || {})) {
      if (v === null) delete env[k];
      else env[k] = v;
    }
    const child = spawn(a.args[0], a.args.slice(1), {
      cwd: a.cwd || cwd,
      env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    child.stdout.on('data', (d) => { process.stdout.write('[term] ' + d); log.write(d); });
    child.stderr.on('data', (d) => { process.stdout.write('[term!] ' + d); log.write(d); });
    child.on('exit', (c, s) => console.log('[term] exited', c, s));
    send({ type: 'response', request_seq: msg.seq, success: true, command: 'runInTerminal', body: { processId: child.pid, shellProcessId: child.pid } });
  }
}

socket.on('connect', () => {
  send({
    type: 'request',
    command: 'initialize',
    arguments: {
      clientID: 'harness',
      adapterID: 'pwa-node',
      pathFormat: 'path',
      supportsRunInTerminalRequest: true,
      supportsStartDebuggingRequest: true,
      linesStartAt1: true,
      columnsStartAt1: true,
    },
  });
});
socket.on('error', (e) => console.error('socket error', e));
