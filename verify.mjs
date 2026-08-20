// Reproduction for https://github.com/vercel/next.js/issues/73913
// Starts `next dev --experimental-https`, then TLS-verifies the "Local" and
// "Network" URLs that Next.js prints, using mkcert's root CA as trust anchor.
import { spawn, execSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import https from 'node:https'
import path from 'node:path'

const lanIp = Object.values(os.networkInterfaces())
  .flat()
  .find((i) => i && i.family === 'IPv4' && !i.internal)?.address

if (!lanIp) throw new Error('No non-internal IPv4 interface found')

const log = fs.openSync('dev-https.log', 'w')
const child = spawn('npx', ['next', 'dev', '--experimental-https', '-p', '3000'], {
  stdio: ['ignore', log, log],
})

const certPath = path.resolve('certificates/localhost.pem')
const deadline = Date.now() + 180_000
while (Date.now() < deadline) {
  if (fs.existsSync(certPath) && fs.readFileSync('dev-https.log', 'utf8').includes('Ready in')) break
  await new Promise((r) => setTimeout(r, 1000))
}

console.log('--- next dev output ---')
console.log(fs.readFileSync('dev-https.log', 'utf8').split('\n').slice(0, 12).join('\n'))
console.log('--- certificate SANs ---')
console.log(execSync(`openssl x509 -in ${certPath} -noout -ext subjectAltName`).toString().trim())

const caroot = path.join(
  execSync(`"${path.join(os.homedir(), '.cache/mkcert', fs.readdirSync(path.join(os.homedir(), '.cache/mkcert'))[0])}" -CAROOT`)
    .toString()
    .trim(),
  'rootCA.pem'
)
const ca = fs.readFileSync(caroot)

function probe(host) {
  return new Promise((resolve) => {
    https
      .get({ host, port: 3000, path: '/', ca }, (res) =>
        resolve(`HTTP ${res.statusCode}`)
      )
      .on('error', (e) => resolve(`${e.code}: ${e.message}`))
  })
}

console.log('--- TLS probes (mkcert rootCA trusted) ---')
console.log('https://localhost:3000   ->', await probe('localhost'))
console.log(`https://${lanIp}:3000 ->`, await probe(lanIp))
child.kill('SIGKILL')
