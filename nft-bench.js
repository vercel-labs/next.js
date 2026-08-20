// Minimal isolation: run @vercel/nft (node-file-trace) directly on both variants.
const path = require('path')
const { nodeFileTrace } = require('next/dist/compiled/@vercel/nft')

async function run(file) {
  const start = Date.now()
  await nodeFileTrace([path.join(__dirname, file)], { base: __dirname })
  return Date.now() - start
}

;(async () => {
  for (const f of ['lib/url-plus.js', 'lib/url-concat.js']) {
    const t = await Promise.race([
      run(f),
      new Promise((r) => setTimeout(() => r('TIMEOUT (>60000ms)'), 60000)),
    ])
    console.log(`${f}: ${typeof t === 'number' ? t + 'ms' : t}`)
    if (typeof t !== 'number') process.exit(1)
  }
})()
