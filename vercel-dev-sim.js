// Mimics what `vercel dev` does: the Vercel CLI loads `.env` (and dashboard env
// vars) into process.env itself, then spawns `next dev`.
const { spawn } = require('child_process')
const dotenv = require('dotenv')
const parsed = dotenv.parse(require('fs').readFileSync('.env'))
console.log('[sim] injecting into process.env from .env:', parsed)
spawn('next', ['dev', '-p', String(process.env.PORT || 3001)], {
  stdio: 'inherit',
  env: { ...process.env, ...parsed },
  shell: false,
  cwd: process.cwd(),
})
