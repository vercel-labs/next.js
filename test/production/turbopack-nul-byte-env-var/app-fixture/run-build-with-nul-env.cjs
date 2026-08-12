// Runs `next build --turbopack` in this directory with an environment variable
// whose value contains a NUL byte, emulating a malformed variable inherited
// from the parent process session (see https://github.com/vercel/next.js/issues/97265).
//
// `process.env[name] = value` truncates the value at the NUL byte, so the whole
// `process.env` object is replaced with a plain object that keeps the byte.
const path = require('path')

// Keep in sync with `index.test.ts`.
const NUL_ENV_VAR_NAME = 'NEXT_TEST_NUL_BYTE_ENV_VAR'

process.env = { ...process.env, [NUL_ENV_VAR_NAME]: 'Remote\u0000' }

process.argv = [process.argv[0], 'next', 'build', '--turbopack', __dirname]

const nextBinPath = path.join(
  path.dirname(require.resolve('next/package.json')),
  'dist/bin/next'
)

require(nextBinPath)
