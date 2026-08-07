// Minimal diagnostic Next.js build adapter.
// Vercel consumes the same `onBuildComplete` routing tables to build its
// deployment routes, so dumping them shows exactly what the platform receives.
const fs = require('fs')

module.exports = {
  name: 'diagnostic-adapter',
  async onBuildComplete(ctx) {
    fs.writeFileSync(
      process.env.ADAPTER_OUT || 'routing.json',
      JSON.stringify(
        {
          nextVersion: require('next/package.json').version,
          dynamicRoutes: ctx.routing.dynamicRoutes,
        },
        null,
        2
      )
    )
  },
}
