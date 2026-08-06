// Patches the installed next FlightClientEntryPlugin to log plugin-state sizes
// right before createActionAssets does the serverActionModules[name] lookup
// that crashes in https://github.com/vercel/next.js/issues/96823.
import fs from 'node:fs'
const p = 'node_modules/next/dist/build/webpack/plugins/flight-client-entry-plugin.js'
const src = fs.readFileSync(p, 'utf8')
const anchor = 'for(let id in pluginState.serverActions){'
if (!src.includes(anchor)) throw new Error('anchor not found - unexpected next version')
if (src.includes('[probe]')) { console.log('already patched'); process.exit(0) }
const probe =
  "console.log('[probe] isEdge=',this.isEdgeServer," +
  "'serverActions=',Object.keys(pluginState.serverActions).length," +
  "'serverActionModules=',JSON.stringify(Object.keys(pluginState.serverActionModules))," +
  "'edgeServerActions=',Object.keys(pluginState.edgeServerActions).length," +
  "'edgeServerActionModules=',JSON.stringify(Object.keys(pluginState.edgeServerActionModules)));\n        "
fs.writeFileSync(p, src.replace(anchor, probe + anchor))
console.log('patched', p)
