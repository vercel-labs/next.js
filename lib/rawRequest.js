// Not using fetch on purpose: mimics axios/db clients, which Next cannot dedupe.
const http = require('http');

module.exports = function rawRequest(path) {
  return new Promise((resolve, reject) => {
    http
      .get({ host: '127.0.0.1', port: 4000, path }, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => resolve(JSON.parse(body)));
      })
      .on('error', reject);
  });
};
