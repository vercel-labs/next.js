// Builds the app with next@16.2.12 and next@16.3.0 using the diagnostic adapter
// and prints the dynamic route entry emitted for the Pages API route.
const { execSync } = require('child_process')
const path = require('path')

for (const version of ['16.2.12', '16.3.0']) {
  execSync(`npm install --no-audit --no-fund --silent next@${version}`, { stdio: 'inherit' })
  execSync(`npx next build`, {
    stdio: 'inherit',
    env: {
      ...process.env,
      NEXT_ADAPTER_PATH: path.join(__dirname, 'adapter.js'),
      ADAPTER_OUT: path.join(__dirname, `routing-${version}.json`),
    },
  })
  const out = require(`./routing-${version}.json`)
  console.log(`\n=== next@${out.nextVersion} dynamicRoutes ===`)
  console.log(JSON.stringify(out.dynamicRoutes, null, 2))
}
