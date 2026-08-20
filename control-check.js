// Control: proves Babel's `compact` option does suppress the log when honored.
const babel = require('next/dist/compiled/babel/core')
const code = require('fs').readFileSync('lib/big-generated-file.js', 'utf8')
for (const compact of ['auto', true]) {
  console.log('--- compact:', compact)
  babel.transformSync(code, { filename: 'lib/big-generated-file.js', babelrc: false, configFile: false, compact })
}
