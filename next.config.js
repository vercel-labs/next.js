const fs = require('fs')
const path = require('path')

module.exports = {
  compiler: {
    // Build lifecycle hook requested in issue #84067
    runAfterProductionCompile: async ({ distDir, projectDir }) => {
      console.log('[hook] runAfterProductionCompile fired')
      console.log('[hook] projectDir:', projectDir)
      console.log('[hook] distDir:', distDir)
      // "I wanna copy static files"
      const src = path.join(projectDir, 'my-static')
      const dest = path.join(distDir, 'copied-static')
      fs.cpSync(src, dest, { recursive: true })
      console.log('[hook] copied static files ->', dest, fs.readdirSync(dest))
    },
  },
}
