// Reloads http://localhost:3001/dashboard 4 times and reports how many
// upstream requests the counter server received per page render.
// /dashboard awaits the same getData() fetch in 4 places:
//   app/layout.js, app/dashboard/layout.js, app/dashboard/page.js, generateMetadata
// Expected (request memoization working): exactly 1 upstream hit per reload.
const http = require('http');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let b = '';
      res.on('data', (c) => (b += c));
      res.on('end', () => resolve(b));
    }).on('error', reject);
  });
}

(async () => {
  for (let i = 1; i <= 4; i++) {
    const before = JSON.parse(await get('http://localhost:8088/__count')).count;
    await get('http://localhost:3001/dashboard');
    await new Promise((r) => setTimeout(r, 1500));
    const after = JSON.parse(await get('http://localhost:8088/__count')).count;
    console.log(`reload ${i}: upstream fetches during render = ${after - before} (expected 1)`);
  }
})();
