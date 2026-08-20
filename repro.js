// Runs `next build --webpack` with fs.readlink patched to fail with EISDIR for
// project files, reproducing Windows exFAT/FAT32 (non-C:) drive behaviour.
const { spawnSync } = require('child_process')
const path = require('path')
const res = spawnSync(
  process.execPath,
  [path.join('node_modules', 'next', 'dist', 'bin', 'next'), 'build', '--webpack'],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --require ./simulate-no-symlink-fs.js`.trim(),
    },
  }
)
process.exit(res.status ?? 1)
