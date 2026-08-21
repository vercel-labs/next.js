const path = require('path');
const fs = require('fs');
module.exports = function info() {
  let readable = false;
  try {
    fs.readdirSync(__dirname);
    readable = true;
  } catch (e) {
    readable = false;
  }
  return {
    dirname: __dirname,
    filename: __filename,
    dirnameExists: fs.existsSync(__dirname),
    dataFileReadable: fs.existsSync(path.join(__dirname, 'data.txt')),
    dirnameReadable: readable,
    cwd: process.cwd(),
  };
};
