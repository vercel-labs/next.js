const fs = require('fs')
module.exports = {
  name: 'repro-adapter',
  onBuildComplete(ctx) {
    fs.writeFileSync('adapter-ctx.json', JSON.stringify(ctx, null, 2))
    console.log('[adapter] keys:', Object.keys(ctx))
  },
}
