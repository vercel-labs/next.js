const fs = require('fs');
const path = require('path');
module.exports = () => ({
  postcssPlugin: 'noop-with-deps',
  Once(root, { result }) {
    const from = result.opts.from || '';
    const inputText = root.toString();
    const liveDisk = fs.readFileSync(from, 'utf8');
    const liveMtime = fs.statSync(from).mtimeMs;
    fs.appendFileSync('/tmp/noop.log',
      `[${Date.now()}] from=${path.basename(from)} match=${inputText === liveDisk} mtime=${liveMtime} input_len=${inputText.length} disk_len=${liveDisk.length}\n`);
    const sibling = path.join(path.dirname(from), 'page.tsx');
    if (fs.existsSync(sibling)) {
      result.messages.push({ type: 'dependency', plugin: 'noop-with-deps', file: sibling, parent: from });
    }
  },
});
module.exports.postcss = true;
