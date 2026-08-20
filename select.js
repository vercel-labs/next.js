const fs = require('fs')
const variant = process.argv[2]
if (variant !== 'concat' && variant !== 'plus') {
  throw new Error('usage: node select.js concat|plus')
}
fs.writeFileSync('lib/target.js', `export * from './url-${variant}'\n`)
console.log('selected variant:', variant)
