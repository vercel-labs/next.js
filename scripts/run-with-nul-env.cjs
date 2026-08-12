// Linux/macOS stand-in for the Windows session described in the issue:
// the OS cannot store a NUL byte in a real env var, so we replace
// `process.env` with a plain object that contains one, exactly as Node on
// Windows observes an inherited `steam_master_ipc_name_override=Remote\0`.
const env = { ...process.env, steam_master_ipc_name_override: 'Remote\u0000' }
Object.defineProperty(process, 'env', { value: env, configurable: true, writable: true })
process.argv = [process.argv[0], require.resolve('next/dist/bin/next'), ...process.argv.slice(2)]
require('next/dist/bin/next')
