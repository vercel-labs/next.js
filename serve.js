const { spawn } = require("child_process");
const procs = [
  ["npx", ["serve", "next-app/out", "-l", "3001"], "."],
  ["npx", ["serve", "static-app", "-l", "3002"], "."],
  ["npx", ["next", "start", "-p", "3003"], "next-app-router"],
];
for (const [cmd, args, cwd] of procs) spawn(cmd, args, { cwd, stdio: "inherit" });
