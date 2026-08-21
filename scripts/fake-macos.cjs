// Preloaded via NODE_OPTIONS="--require ./scripts/fake-macos.cjs".
// Only the Next.js devtools launch-editor module sees platform === 'darwin'
// and a macOS `ps x` listing with VSCodium running. Faking the platform
// globally would break the SWC/Turbopack native bindings on a Linux/CI host.
const child_process = require('child_process')
const realPlatform = process.platform
const PS = `  PID   TT  STAT      TIME COMMAND
 4711   ??  S      3:21.11 /Applications/VSCodium.app/Contents/MacOS/VSCodium
`
function fromLaunchEditor() {
  return /next-devtools[\\/]server[\\/]launch-editor/.test(
    new Error().stack || ''
  )
}
Object.defineProperty(process, 'platform', {
  configurable: true,
  get: () => (fromLaunchEditor() ? 'darwin' : realPlatform),
})
const realExecSync = child_process.execSync
child_process.execSync = (cmd, ...rest) =>
  typeof cmd === 'string' && cmd.startsWith('ps x') && fromLaunchEditor()
    ? Buffer.from(PS)
    : realExecSync(cmd, ...rest)
