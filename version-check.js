// Minimal stand-in for libraries (e.g. @neynar/nodejs-sdk) that gate on
// process.version at module scope.
const version = process.version
console.log('[repro] typeof process.version =', typeof version, '/ value =', version)
if (!version || Number(version.slice(1).split('.')[0]) < 19) {
  console.error(`Unsupported Node.js version! Your version: ${version}. Required version: >=19.9.0.`)
  process.exit(1)
}
