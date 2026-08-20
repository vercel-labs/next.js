// Vercel's file upload strips .env files, so the reproduction writes the
// .env file itself right before `next build` runs. This is equivalent to
// committing a `.env` file to the repository (as issue #67296 describes).
const fs = require('fs')
fs.writeFileSync('.env', 'MY_SECRET=from-dotenv\nNEXT_PUBLIC_MY_PUBLIC=public-from-dotenv\n')
console.log('[generate-env] wrote .env:', fs.readFileSync('.env', 'utf8'))
