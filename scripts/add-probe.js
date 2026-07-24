// Adds two console.error lines to next's dev watcher so the aggregation
// behavior is observable. Pure logging - no behavior change.
const fs = require('fs')
const path = require('path')

const file = path.join(
  __dirname,
  '..',
  'node_modules/next/dist/server/lib/router-utils/setup-dev-bundler.js'
)
let src = fs.readFileSync(file, 'utf8')
if (src.includes('AGG-PROBE')) {
  console.log('probe already present')
  process.exit(0)
}
src = src.replace(
  "wp.on('aggregated', async ()=>{",
  "wp.on('aggregated', async ()=>{\n            console.error('[AGG-PROBE] aggregated fired at', Date.now());"
)
src = src.replace(
  'const sortedRoutes = (0, _utils.getSortedRoutes)(routedPages);',
  "console.error('[AGG-PROBE] routedPages count:', routedPages.length, 'dynamic routes:', routedPages.filter(function(x){return x.includes('[')}).length, 'at', Date.now());\n                const sortedRoutes = (0, _utils.getSortedRoutes)(routedPages);"
)
fs.writeFileSync(file, src)
console.log('probe added to', file)
